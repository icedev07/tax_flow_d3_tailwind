# Tax Flow Visualizer

An interactive web-based tool that visualizes how different tax parameters influence government revenue. Built with Tailwind CSS and D3.js, this tool makes tax policy accessible and understandable for users of all ages.

## Features

- Interactive sliders to adjust tax rates and GDP growth
- Real-time visualization of revenue impact
- Responsive design that works on all devices
- Tooltips showing detailed information on hover
- Modern, clean UI with smooth animations

## Parameters

The tool allows you to adjust:

1. Income Tax Rate (0-50%)
2. Corporate Tax Rate (0-40%)
3. Sales Tax Rate (0-20%)
4. GDP Growth Rate (-5% to 10%)

## How to Use

1. Open `index.html` in a modern web browser
2. Use the sliders in the left panel to adjust tax rates and GDP growth
3. Watch the graph update in real-time to show the projected revenue impact
4. Hover over data points to see detailed information

## Technical Details

- Built with vanilla JavaScript, HTML5, and CSS
- Uses Tailwind CSS for styling
- D3.js for data visualization
- No build process required - just open and use!

## Assumptions

The revenue calculations make the following assumptions:
- 60% of GDP is personal income
- 20% of GDP is corporate profits
- 80% of GDP is consumer spending
- Base GDP is set to $1 trillion
- Projections are made for 10 years

## Browser Support

Works in all modern browsers that support:
- ES6 JavaScript
- CSS Grid
- SVG

## License

MIT License - feel free to use and modify for your own projects! 