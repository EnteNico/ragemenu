exports('SendNUIMessage', function(input)
    SendNUIMessage(input)
end)

RegisterNUICallback('activeItem', function(data, cb)
    local r = data.resource
    if (r == 'ragemenu') then cb('ok') return end
    local resource = exports[r] or nil
    if (resource == nil) then cb('ok') return end
    local nuiCallback = resource['NUICallback'] or nil
    if (nuiCallback == nil) then cb('ok') return end
    
    exports[r]:NUICallback('activeItem', data, cb)
end)

RegisterNUICallback('selectItem', function(data, cb)
    local r = data.resource
    if (r == 'ragemenu') then cb('ok') return end
    local resource = exports[r] or nil
    if (resource == nil) then cb('ok') return end
    local nuiCallback = resource['NUICallback'] or nil
    if (nuiCallback == nil) then cb('ok') return end

    exports[r]:NUICallback('selectItem', data, cb)
end)

RegisterNUICallback('changeItem', function(data, cb)
    local r = data.resource
    if (r == 'ragemenu') then cb('ok') return end
    local resource = exports[r] or nil
    if (resource == nil) then cb('ok') return end
    local nuiCallback = resource['NUICallback'] or nil
    if (nuiCallback == nil) then cb('ok') return end
    
    exports[r]:NUICallback('changeItem', data, cb)
end)

RegisterNUICallback('closeMenu', function(data, cb)
    local r = data.resource
    if (r == 'ragemenu') then cb('ok') return end
    local resource = exports[r] or nil
    if (resource == nil) then cb('ok') return end
    local nuiCallback = resource['NUICallback'] or nil
    if (nuiCallback == nil) then cb('ok') return end

    exports[r]:NUICallback('closeMenu', data, cb)
    cb('ok')
end)

RegisterNUICallback('upDownSound', function(data, cb)
    local r = data.resource
    if (r == 'ragemenu') then cb('ok') return end
    local resource = exports[r] or nil
    if (resource == nil) then cb('ok') return end
    local nuiCallback = resource['NUICallback'] or nil
    if (nuiCallback == nil) then cb('ok') return end

    exports[r]:NUICallback('upDownSound', data, cb)
    cb('ok')
end)