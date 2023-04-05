RageUI = setmetatable({}, RageUI)
RageUI.__index = RageUI

RageUI.CurrentMenu = nil
RageUI.OpenedMenus = {}

function RageUI:Create(name, title, subtitle)
    local Menu = {
        Name = name,
        Title = title,
        Subtitle = subtitle,
        Items = {},
        _Visible = false,
        _Events = {}
    }

    function Menu:On(event, callback)
        if not self._Events[event] then
            self._Events[event] = {}
        end

        table.insert(self._Events[event], callback)
    end

    function Menu:Trigger(event, data)
        if self._Events[event] then
            for key, value in pairs(self._Events[event]) do
                value(data)
            end
        end
    end

    return setmetatable(Menu, RageUI)
end

function RageUI:Button(label, description, rightLabel, backgroundColor)
    local Item = {
        type = 'button',
        label = label,
        description = description,
        rightLabel = rightLabel,
        background = backgroundColor,
        uuid = uuid(),
        _Events = {}
    }

    function Item:On(event, callback)
        if not self._Events[event] then
            self._Events[event] = {}
        end

        table.insert(self._Events[event], callback)
    end

    function Item:Trigger(event, ...)
        if self._Events[event] then
            for key, value in pairs(self._Events[event]) do
                value(...)
            end
        end
    end

    table.insert(self.Items, Item)
    return setmetatable(Item, RageUI)
end

function RageUI:Placeholder(label)
    local Item = {
        type = 'placeholder',
        label = label,
        uuid = uuid(),
        _Events = {}
    }

    table.insert(self.Items, Item)
    return setmetatable(Item, RageUI)
end

function RageUI:Slider(label, description, min, max, current)
    local Item = {
        type = 'slider',
        label = label,
        description = description or nil,
        uuid = uuid(),
        options = {
            min = min or 0,
            max = max or 100,
            current = current or 0,
        },
        _Events = {}
    }

    function Item:On(event, callback)
        if not self._Events[event] then
            self._Events[event] = {}
        end

        table.insert(self._Events[event], callback)
    end

    function Item:Trigger(event, ...)
        if self._Events[event] then
            for key, value in pairs(self._Events[event]) do
                value(...)
            end
        end
    end

    table.insert(self.Items, Item)
    return setmetatable(Item, RageUI)
end

function RageUI:Select(label, description, items, current)
    local Item = {
        type = 'select',
        label = label,
        description = description or nil,
        uuid = uuid(),
        options = {
            items = items or {},
            current = current or 0,
        },
        _Events = {}
    }

    function Item:On(event, callback)
        if not self._Events[event] then
            self._Events[event] = {}
        end

        table.insert(self._Events[event], callback)
    end

    function Item:Trigger(event, ...)
        if self._Events[event] then
            for key, value in pairs(self._Events[event]) do
                value(...)
            end
        end
    end

    table.insert(self.Items, Item)
    return setmetatable(Item, RageUI)
end

function RageUI:Name()
    return self.Name
end

function RageUI:Visible(value)
    self._Visible = value

    if not value then
        SendNUIMessage({
            action = 'toggle',
            data = {
                component = 'rageui',
                bool = false
            }
        })
        SetNuiFocus(false, false)
        SetNuiFocusKeepInput(false)
    end
end

function RageUI:Open()
    local length = #RageUI.OpenedMenus
    self:Visible(true)
    table.insert(RageUI.OpenedMenus, self)

    local data = {
        name = self.Name,
        title = self.Title,
        subtitle = self.Subtitle,
        maxItems = 12,
        items = RageUI:SerializeItems(self.Items)
    }

    if length > 0 then
        SendNUIMessage({
            action = 'rageui:update',
            data = data
        })
    else
        SendNUIMessage({
            action = 'toggle',
            data = {
                component = 'rageui',
                bool = true,
                data = data
            }
        })
    end
    SetNuiFocus(true, false)
    SetNuiFocusKeepInput(true)

    RageUI.CurrentMenu = self
    self:Trigger('visible', true)
end

function RageUI:Back()
    local length = #RageUI.OpenedMenus
    local menu = RageUI.OpenedMenus[length - 1]
    local currentMenu = RageUI.OpenedMenus[length]

    if menu.Name == currentMenu.Name then
        RageUI.OpenedMenus = {}
        return RageUI:Close()
    end

    if menu then
        menu:Open()
        table.remove(RageUI.OpenedMenus, length)
        RageUI.CurrentMenu = menu
    end
end

function RageUI:Close()
    RageUI.CurrentMenu:Trigger('visible', false)
    self:Visible(false)
end

function RageUI:SerializeItems(items)
    local serialized = {}

    for key, value in pairs(items) do
        table.insert(serialized, {
            type = value.type,
            label = value.label,
            description = value.description,
            rightLabel = value.rightLabel,
            background = value.background,
            uuid = value.uuid,
            options = value.options
        })
    end

    return serialized
end

uuid = function()
	local fn = function(x)
		local r = math.random(16) - 1
		r = (x == "x") and (r + 1) or (r % 4) + 9
		return ("0123456789abcdef"):sub(r, r)
	end
	return (("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"):gsub("[xy]", fn))
end