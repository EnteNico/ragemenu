Keys = setmetatable({
    __class = 'RageMenuKeys',
    __type = 'keys',
}, {
    __newindex = function(table, key, value)
        if value == 'KEY_PRESSED' then
            SendNUIMessage({ action = 'keypress', data = key })
        elseif value == 'KEY_RELEASED' then
            SendNUIMessage({ action = 'keyrelease', data = key })
        end
    end,
})

function RegisterKey(action, description, defaultType, defaultKey)
    local data = {
        action = action, 
        description = description, 
        defaultType = defaultType, 
        defaultKey = defaultKey
    }

    RegisterKeyMapping(('+%s'):format(defaultKey), description, defaultType, defaultKey)
    RegisterCommand(('+%s'):format(defaultKey), function()
        Keys[action] = 'KEY_PRESSED'
    end, false)
    RegisterCommand(('-%s'):format(defaultKey), function() 
        Keys[action] = 'KEY_RELEASED'
    end, false)

    return data
end

RegisterKey('UP', 'UP', 'KEYBOARD', 'UP')
RegisterKey('DOWN', "DOWN", 'KEYBOARD', 'DOWN')
RegisterKey('LEFT', "LEFT", 'KEYBOARD', 'LEFT')
RegisterKey('RIGHT', "RIGHT", 'KEYBOARD', 'RIGHT')
RegisterKey('ENTER', "RETURN", 'KEYBOARD', 'RETURN')
RegisterKey('CLOSE', 'BACK', 'KEYBOARD', 'BACK')