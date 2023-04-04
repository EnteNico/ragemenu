RegisterNUICallback('playSound', function(data, cb)
    local audioId
    if not data.loop then
        PlaySoundFrontend(-1, data.set, data.name, 1)
    else
        if not audioId then
            CreateThread(function()
                audioId = GetSoundId()
                PlaySoundFrontend(audioId, data.set, data.name, true)
                Wait(0.01)
                StopSound(audioId)
                ReleaseSoundId(audioId)
                audioId = nil
            end)
        end
    end
end)

RegisterNUICallback('rageui:click', function(data, cb)
    local uuid = data.item.uuid

    if RageUI.CurrentMenu == nil then
        return
    end

    for key, value in pairs(RageUI.CurrentMenu.Items) do
        if value.uuid == uuid then
            value:Trigger('click', data.item)
            break
        end
    end
end)

RegisterNUICallback('rageui:change', function(data, cb)
    local uuid, typ = data.item.uuid, data.item.type

    if RageUI.CurrentMenu == nil then
        return
    end

    for key, value in pairs(RageUI.CurrentMenu.Items) do
        if value.uuid == uuid then
            value:Trigger('change', data.item.options.current)
            break
        end
    end
end)

RegisterNUICallback('rageui:back', function(data, cb)
    if RageUI.CurrentMenu == nil or #RageUI.OpenedMenus <= 1 then
        RageUI.OpenedMenus = {}
        return RageUI:Close()
    end

    RageUI:Back()
end)