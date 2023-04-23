RegisterCommand("testmenu", function()
    local TestMenu = RageUI:Create('test', 'Test Menu', 'This is a test menu')
    local TestSubMenu = RageUI:Create('testsub', 'Test SubMenu', 'This is a test submenu')
    local options = {'Option 1', 'Option 2', 'Option 3'}
    
    TestMenu:Placeholder('Placeholder')
    TestMenu:Placeholder('Placeholder ~b~Colored')
    local TestMenuButton = TestMenu:Button('Test Button', 'This is a test button', 'Right Label')
    TestMenu:Button('Test Button Disabled', 'This is a test button', nil, { disabled = true })
    local TestMenuSlider = TestMenu:Slider('Test Slider', 'This is a test slider', 0, 100, 1)
    local TestMenuSelect = TestMenu:Select('Test Select', 'This is a test select', options, 1)
    
    local TestSubMenuButton = TestSubMenu:Button('Test SubMenu Button', 'This is a test submenu button', 'Right Label', {
        disabled = true
    })
    local TestSubMenuCheckbox = TestSubMenu:Checkbox('Checkbox', 'This is a test checkbox', false)
    local TestSubMenuCheckbox2 = TestSubMenu:Checkbox('Checkbox with cross style', 'This is a test checkbox with cross style', false, {
        style = 'cross'
    })

    TestMenuButton:On('click', function(item)
        TestSubMenu:Open()
    end)

    TestSubMenuButton:On('click', function(item)
        print('TestSubMenuButton clicked')
    end)

    TestSubMenuCheckbox:On('click', function(item)
        local value = item.options.checked and 'Checked' or 'Unchecked'
        print('TestSubMenuCheckbox ' .. value)
    end)

    TestMenuSlider:On('change', function(value)
        print('Slider value changed to ' .. value)
    end)

    TestMenuSelect:On('change', function(index)
        print('Select value changed to ' .. options[index + 1])
    end)

    TestMenu:On('visible', function(state)
        print('TestMenu is now ' .. (state and 'visible' or 'hidden'))
    end)
    
    TestMenu:Open()
end)