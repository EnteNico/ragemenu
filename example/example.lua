function OpenMenu()
    local mainMenu = RageMenu:CreateMenu('RageUI', 'RageUI Example Menu')
    local subMenu = RageMenu:CreateMenu('Submenu', 'Submenu Subtitle')

    mainMenu:AddPlaceholder('Test')
    mainMenu:AddButton('Button', 'Button Description'):On('click', function(item)
        print('Clicked Button')
    end)
    mainMenu:AddSubmenu(subMenu, 'Submenu', 'Submenu Description')

    local sidePanelBtn = mainMenu:AddButton('Button', 'Button Description')
    sidePanelBtn:AddSidePanel('Title', 'sidepanel', {
        {
            leftLabel = 'Left Label',
            rightLabel = 'Right Label',
        },
        {
            leftLabel = 'Left Label',
            rightLabel = 'Right Label',
        },
        {
            leftLabel = 'Left Label',
            rightLabel = 'Right Label',
        },
    })
    sidePanelBtn:On('click', function(item)
        print('Clicked Sidepanel Button')
    end)

    subMenu:AddButton('Submenu Button', 'Button Description'):On('click', function(item)
        print('Clicked Submenu Button')
    end)

    RageMenu:OpenMenu(mainMenu)
end

RageMenu:RegisterKey("F1", "F1", "Open Menu", function()
    OpenMenu()
end)