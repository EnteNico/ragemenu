--- @class RageMenu
RageMenu = {}
RageMenu = setmetatable({
    __class = 'RageMenu',
    __type = 'RageMenu',
    CurrentMenu = nil,
    CurrentResourceName = GetCurrentResourceName(),
    Loaded = false,
    Menus = {},
    OpenedMenus = {},
    NUICallbacks = {},
}, {})

local function SENDNUIMESSAGE(message)
    exports['ragemenu']:SendNUIMessage(message)
end

local REGISTERNUICALLBACK = function(name, cb)
    RageMenu.NUICallbacks[name] = cb
end

--- @param controls string The control name
--- @param controlName string The control name
--- @param description string The control description
--- @param callback function The callback function
function RageMenu:RegisterKey(controls, controlName, description, callback)
    RegisterKeyMapping(string.format('keys-%s', controlName), description, "keyboard", controls)
    RegisterCommand(string.format('keys-%s', controlName), function()
        if (callback ~= nil) then
            callback()
        end
    end, false)
end

--- Create a new RageMenu
--- @param title string Title of the menu
--- @param subtitle? string Subtitle of the menu
--- @param position? 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center' | 'center-right' | 'center-left' Position of the menu
--- @param banner? string Banner of the menu
--- @param maxItems? number Max items of the menu
function RageMenu:CreateMenu(title, subtitle, position, banner, maxItems)
    local menu = {
        uuid = RageMenu:GenerateUUID(),
        resource = GetCurrentResourceName(),
        title = title,
        subtitle = subtitle,
        maxItems = maxItems or 10,
        position = position or 'top-left',
        banner = banner,
        items = {},
    }

    --- @param name string
    function menu:AddPlaceholder(name)
        local Item = {
            uuid = RageMenu:GenerateUUID(),
            name = name,
            type = 'placeholder',
        }

        function Item:Update(name)
            local oldItem = self
            local newItem = {
                uuid = oldItem.uuid,
                name = name or oldItem.name,
                type = 'placeholder',
            }

            SENDNUIMESSAGE({
                action = 'updateItem',
                data = {
                    menuUUID = RageMenu.CurrentMenu.uuid,
                    oldItem = oldItem,
                    newItem = newItem,
                }
            })
        end

        table.insert(self.items, Item)
        return Item
    end

    --- @param name string The name of the button
    --- @param description? string The description of the button
    --- @param background? string The background of the button
    function menu:AddSubmenu(submenu, name, description, rightLabel, disabled, background)
        submenu.parent = menu
        local Item = {
            uuid = RageMenu:GenerateUUID(),
            name = name,
            description = description,
            background = background,
            rightLabel = rightLabel,
            disabled = disabled,
            type = 'button',
            submenu = submenu.uuid,
            _events = {}
        }

        function Item:On(event, callback)
            if not self._events[event] then
                self._events[event] = {}
            end
    
            table.insert(self._events[event], callback)
        end
    
        function Item:Trigger(event, ...)
            if self._events[event] then
                for _, value in pairs(self._events[event]) do
                    value(...)
                end
            end
        end
        
        table.insert(self.items, Item)
        return Item
    end

    --- @param name string The name of the button
    --- @param description? string The description of the button
    --- @param rightLabel? string The right label of the button
    --- @param background? string The background of the button
    function menu:AddButton(name, description, rightLabel, disabled, background)
        local Item = {
            uuid = RageMenu:GenerateUUID(),
            name = name,
            description = description,
            background = background,
            rightLabel = rightLabel,
            disabled = disabled,
            type = 'button',
            _events = {}
        }

        function Item:On(event, callback)
            if not self._events[event] then
                self._events[event] = {}
            end
    
            table.insert(self._events[event], callback)
        end
    
        function Item:Trigger(event, ...)
            if self._events[event] then
                for _, value in pairs(self._events[event]) do
                    value(...)
                end
            end
        end

        function Item:AddSidePanel(title, image, items)
            self.sidepanel = {
                title = title,
                image = image,
                items = items
            }
        end

        function Item:Update(name, description, rightLabel, background)
            local oldItem = self
            local newItem = {
                uuid = oldItem.uuid,
                name = name or oldItem.name,
                description = description or oldItem.description,
                background = background or oldItem.background,
                rightLabel = rightLabel or oldItem.rightLabel,
                type = 'button',
                _events = oldItem._events
            }

            SENDNUIMESSAGE({
                action = 'updateItem',
                data = {
                    menuUUID = RageMenu.CurrentMenu.uuid,
                    oldItem = oldItem,
                    newItem = newItem,
                }
            })
        end

        table.insert(self.items, Item)
        return Item
    end

    --- @param name string The name of the button
    --- @param description? string The description of the button
    --- @param background? string The background of the button
    --- @param min? number The min value of the slider
    --- @param max? number The max value of the slider
    --- @param value? number The value of the slider
    --- @param step? number The step of the slider
    function menu:AddSlider(name, description, background, min, max, value, step)
        local Item = {
            uuid = RageMenu:GenerateUUID(),
            name = name,
            description = description,
            background = background,
            type = 'slider',
            other = {
                min = min or 0,
                max = max or 100,
                value = value or 0,
                step = step or 1,
            },
            _events = {}
        }

        function Item:On(event, callback)
            if not self._events[event] then
                self._events[event] = {}
            end
    
            table.insert(self._events[event], callback)
        end

        function Item:Trigger(event, ...)
            if self._events[event] then
                for _, value in pairs(self._events[event]) do
                    value(...)
                end
            end
        end

        table.insert(self.items, Item)
        return Item
    end

    --- @param name string The name of the button
    --- @param description? string The description of the button
    --- @param background? string The background of the button
    --- @param items? table The items of the list
    --- @param current? number The current item of the list
    function menu:AddList(name, description, background, items, current)
        local Item = {
            uuid = RageMenu:GenerateUUID(),
            name = name,
            description = description,
            background = background,
            type = 'list',
            other = {
                type = type or 'default',
                items = items or {},
                current = current - 1 or 0,
            },
            _events = {}
        }

        function Item:On(event, callback)
            if not self._events[event] then
                self._events[event] = {}
            end
    
            table.insert(self._events[event], callback)
        end

        function Item:Trigger(event, ...)
            if self._events[event] then
                for _, value in pairs(self._events[event]) do
                    value(...)
                end
            end
        end

        table.insert(self.items, Item)
        return Item
    end

    --- @param name string The name of the button
    --- @param description? string The description of the button
    --- @param background? string The background of the button
    --- @param checked? boolean The checked of the checkbox
    function menu:AddCheckbox(name, description, background, checked)
        local Item = {
            uuid = RageMenu:GenerateUUID(),
            name = name,
            description = description,
            background = background,
            type = 'checkbox',
            other = {
                checked = checked or false
            },
            _events = {}
        }

        function Item:On(event, callback)
            if not self._events[event] then
                self._events[event] = {}
            end
    
            table.insert(self._events[event], callback)
        end

        function Item:Trigger(event, ...)
            if self._events[event] then
                for _, value in pairs(self._events[event]) do
                    value(...)
                end
            end
        end

        table.insert(self.items, Item)
        return Item
    end

    function menu:RemoveItem(item)
        for index, value in pairs(self.items) do
            if value.uuid == item.uuid then
                table.remove(self.items, index)
                menu:Reopen()
            end
        end
    end

    function menu:Reopen()
        RageMenu:Close(menu)
        Wait(100)
        RageMenu:OpenMenu(menu)
    end

    table.insert(RageMenu.Menus, menu)
    return menu or {}
end

function RageMenu:OpenMenu(menu)
    if not menu or not menu.uuid then return end
    
    SENDNUIMESSAGE({
        action = 'setVisible',
        data = {
            visible = true,
            data = menu
        },
    })

    RageMenu.CurrentMenu = menu
    table.insert(RageMenu.OpenedMenus, menu)
end

function RageMenu:Close(menu)
    if RageMenu.CurrentMenu then
        SENDNUIMESSAGE({
            action = 'setVisible',
            data = {
                visible = false,
                data = {}
            },
        })
        RageMenu.CurrentMenu = nil
        RageMenu:RemoveOpenedMenu(menu.uuid)
    end
end

function RageMenu:CloseAll()
    if RageMenu.CurrentMenu then
        SENDNUIMESSAGE({
            action = 'setVisible',
            data = {
                visible = false,
                data = {}
            },
        })
        RageMenu.OpenedMenus = {}
        RageMenu.CurrentMenu = nil
    end
end

function RageMenu:GoBack(currentMenu)
    if not currentMenu then return end

    local current = RageMenu.CurrentMenu
    local hasSubmenu = currentMenu ~= nil
    RageMenu:Close(current)
    RageMenu:PlaySound('Back')

    if hasSubmenu then
        return RageMenu:OpenMenu(current.parent)
    end
end

function RageMenu:SelectItem(item)
    if RageMenu.CurrentMenu then
        for _, value in pairs(RageMenu.CurrentMenu.items) do
            if value.uuid == item.uuid then
                if value.disabled then return RageMenu:PlaySound('Error') end
                local hasSubmenu = value.submenu ~= nil
                if hasSubmenu then
                    local submenu = RageMenu:GetMenuByUUID(value.submenu)
                    if not submenu then
                        goto continue
                    end

                    RageMenu:Close(RageMenu.CurrentMenu)
                    RageMenu:OpenMenu(submenu)
                    table.insert(RageMenu.OpenedMenus, submenu)

                    ::continue::
                end

                RageMenu:PlaySound('Select')
                value:Trigger('click', value)
            end
        end
    end
end

function RageMenu:ChangeItem(oldItem, newItem)
    if RageMenu.CurrentMenu and GetCurrentResourceName() ~= "ragemenu" then
        for _, value in pairs(RageMenu.CurrentMenu.items) do
            if value.uuid == oldItem.uuid and value.type ~= 'placeholder' then
                if value.type == 'slider' then 
                    RageMenu:PlaySound('Slider')
                elseif value.type == 'list' then
                    RageMenu:PlaySound('LeftRight')
                elseif value.type == 'checkbox' then
                    RageMenu:PlaySound('Select')
                end

                value:Trigger('change', newItem, oldItem)
            end
        end
    end
end

function RageMenu:PlaySound(type)
    local sounds = {
        ["UpDown"] = {
            audioName = "HUD_FRONTEND_DEFAULT_SOUNDSET",
            audioRef = "NAV_UP_DOWN",
            loop = false
        },
        ["LeftRight"] = {
            audioName = "HUD_FRONTEND_DEFAULT_SOUNDSET",
            audioRef = "NAV_LEFT_RIGHT",
            loop = false
        },
        ["Select"] = {
            audioName = "HUD_FRONTEND_DEFAULT_SOUNDSET",
            audioRef = "SELECT",
            loop = false
        },
        ["Back"] = {
            audioName = "HUD_FRONTEND_DEFAULT_SOUNDSET",
            audioRef = "BACK",
            loop = false
        },
        ["Error"] = {
            audioName = "HUD_FRONTEND_DEFAULT_SOUNDSET",
            audioRef = "ERROR",
            loop = false
        },
        ["Slider"] = {
            audioName = "HUD_FRONTEND_DEFAULT_SOUNDSET",
            audioRef = "CONTINUOUS_SLIDER",
            loop = true,
        },
    }

    if not sounds[type] then return end
    local IsLooped, Sound, Library = sounds[type].loop, sounds[type].audioRef, sounds[type].audioName

    local audioId
    if not IsLooped then
        PlaySoundFrontend(-1, Sound, Library, true)
    else
        if not audioId then
            Citizen.CreateThread(function()
                audioId = GetSoundId()
                PlaySoundFrontend(audioId, Sound, Library, true)
                Citizen.Wait(0.01)
                StopSound(audioId)
                ReleaseSoundId(audioId)
                audioId = nil
            end)
        end
    end
end

function RageMenu:GetMenuByUUID(uuid)
    for _, value in pairs(RageMenu.Menus) do
        if value.uuid == uuid then
            return value
        end
    end
end

function RageMenu:RemoveOpenedMenu(uuid)
    for index, value in pairs(RageMenu.OpenedMenus) do
        if value.uuid == uuid then
            table.remove(RageMenu.OpenedMenus, index)
        end
    end
end

function RageMenu:IsOpen()
    return RageMenu.CurrentMenu ~= nil
end

function RageMenu:GenerateUUID()
    local fn = function(x)
        local r = math.random(16) - 1
        r = (x == 'x') and (r + 1) or (r % 4) + 9
        return ('0123456789abcdef'):sub(r, r)
    end
    return (('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'):gsub('[xy]', fn))
end

function RageMenu:CopyClipboard(value)
    if not value then return end
    SENDNUIMESSAGE({
        action = 'copyClipboard',
        data = {
            value = value
        }
    })
end

REGISTERNUICALLBACK('activeItem', function(data, cb)
    cb(true)
end)

REGISTERNUICALLBACK('upDownSound', function(data, cb)
    RageMenu:PlaySound('UpDown')
    cb(true)
end)

REGISTERNUICALLBACK('selectItem', function(data, cb)
    local item = data.item
    RageMenu:SelectItem(item)
    cb(true)
end)

REGISTERNUICALLBACK('changeItem', function(data, cb)
    local oldItem, newItem = data.oldItem, data.newItem
    RageMenu:ChangeItem(oldItem, newItem)
    cb(true)
end)

REGISTERNUICALLBACK('closeMenu', function(data, cb)
    RageMenu:GoBack(data)
    cb(true)
end)

exports('NUICallback', function(name, info, cb)
    if RageMenu.NUICallbacks == nil or RageMenu.NUICallbacks[name] == nil then return print('Not found') end
    RageMenu.NUICallbacks[name](info, cb)
end)