-- RegisterCommand("testmenu", function()
--     local TestMenu = RageUI:Create('test', 'Test Menu', 'This is a test menu')
--     local TestSubMenu = RageUI:Create('testsub', 'Test SubMenu', 'This is a test submenu')
--     local options = {'Option 1', 'Option 2', 'Option 3'}
    
--     local TestMenuButton = TestMenu:Button('Test Button', 'This is a test button', 'Right Label')
--     local TestMenuPlaceholder = TestMenu:Placeholder('Test Placeholder')
--     local TestMenuSlider = TestMenu:Slider('Test Slider', 'This is a test slider', 0, 100, 1)
--     local TestMenuSelect = TestMenu:Select('Test Select', 'This is a test select', options, 1)

--     local TestSubMenuButton = TestSubMenu:Button('Test SubMenu Button', 'This is a test submenu button', 'Right Label')

--     TestMenuButton:On('click', function(item)
--         TestSubMenu:Open()
--     end)

--     TestMenuSlider:On('change', function(value)
--         print('Slider value changed to ' .. value)
--     end)

--     TestMenuSelect:On('change', function(index)
--         print('Select value changed to ' .. options[index + 1])
--     end)

--     TestMenu:On('visible', function(state)
--         print('TestMenu is now ' .. (state and 'visible' or 'hidden'))
--     end)
    
--     TestMenu:Open()
-- end)