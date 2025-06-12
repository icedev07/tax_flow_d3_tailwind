// Constants for calculations
// const YEARS = 10; // Number of years to project (now dynamic)

// Initialize the visualization
function initVisualization() {
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = document.getElementById('visualization').clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select('#visualization')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleLinear()
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, 1]) // Will be updated dynamically
        .range([height, 0]);

    // Add axes (initial call, will be updated later)
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`);

    svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `$${(d/1000000).toFixed(1)}B`).tickPadding(10));

    // Add axis labels
    svg.append('text')
        .attr('class', 'x-axis-label')
        .attr('transform', `translate(${width/2}, ${height + margin.bottom - 5})`)
        .style('text-anchor', 'middle')
        .text('Year');

    svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 55)
        .attr('x', -(height / 2))
        .style('text-anchor', 'middle')
        .text('Revenue (Billions)');

    return { svg, xScale, yScale, width, height };
}

// Calculate revenue based on tax rates and GDP growth
function calculateRevenue(baseGDP, incomeTax, corporateTax, salesTax, gdpGrowth, years) {
    const revenue = [];
    let currentGDP = baseGDP * 1000000; // Convert billions to millions

    for (let year = 0; year < years; year++) {
        // Calculate tax revenue from different sources
        const incomeTaxRevenue = currentGDP * 0.6 * (incomeTax / 100); // Assuming 60% of GDP is personal income
        const corporateTaxRevenue = currentGDP * 0.2 * (corporateTax / 100); // Assuming 20% of GDP is corporate profits
        const salesTaxRevenue = currentGDP * 0.8 * (salesTax / 100); // Assuming 80% of GDP is consumer spending

        const totalRevenue = incomeTaxRevenue + corporateTaxRevenue + salesTaxRevenue;
        revenue.push(totalRevenue);

        // Update GDP for next year
        currentGDP *= (1 + gdpGrowth / 100);
    }

    return revenue;
}

// Update the visualization
function updateVisualization(revenue, years) {
    const { svg, xScale, yScale, width, height } = window.viz;

    // Update x-scale domain based on number of years
    xScale.domain([0, years - 1]);

    // Update y-scale domain based on revenue data
    const maxRevenue = Math.max(...revenue);
    yScale.domain([0, maxRevenue * 1.1]); // Add 10% padding

    // Update x-axis
    svg.select('.x-axis')
        .transition().duration(500)
        .call(d3.axisBottom(xScale).ticks(years).tickFormat(d => `Year ${d + 1}`));

    // Update y-axis
    svg.select('.y-axis')
        .transition().duration(500)
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `$${(d/1000000).toFixed(1)}B`).tickPadding(10));

    // Remove existing line
    svg.selectAll('.revenue-line').remove();
    svg.selectAll('.revenue-point').remove();

    // Create line generator
    const line = d3.line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d))
        .curve(d3.curveMonotoneX);

    // Add the line
    svg.append('path')
        .datum(revenue)
        .attr('class', 'revenue-line')
        .attr('fill', 'none')
        .attr('stroke', '#4f46e5')
        .attr('stroke-width', 3)
        .attr('d', line);

    // Add points
    svg.selectAll('.revenue-point')
        .data(revenue)
        .enter()
        .append('circle')
        .attr('class', 'revenue-point')
        .attr('cx', (d, i) => xScale(i))
        .attr('cy', d => yScale(d))
        .attr('r', 4)
        .attr('fill', '#4f46e5')
        .on('mouseover', function(event, d) {
            const tooltip = d3.select('#tooltip');
            tooltip
                .style('display', 'block')
                .html(`Year ${revenue.indexOf(d) + 1}<br>Revenue: $${(d/1000000).toFixed(2)}B`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
            d3.select('#tooltip').style('display', 'none');
        });
}

// Initialize controls
function initControls() {
    const controls = ['baseGDP', 'incomeTax', 'corporateTax', 'salesTax', 'gdpGrowth', 'projectionYears'];
    
    controls.forEach(control => {
        const input = document.getElementById(control);
        const valueDisplay = document.getElementById(control + 'Value');
        
        input.addEventListener('input', function() {
            if (valueDisplay) {
                valueDisplay.textContent = this.value + (control.includes('Tax') || control.includes('Growth') ? '%' : '');
            }
            updateAll();
        });
    });
}

function updateAll() {
    const baseGDP = parseFloat(document.getElementById('baseGDP').value);
    const incomeTax = parseFloat(document.getElementById('incomeTax').value);
    const corporateTax = parseFloat(document.getElementById('corporateTax').value);
    const salesTax = parseFloat(document.getElementById('salesTax').value);
    const gdpGrowth = parseFloat(document.getElementById('gdpGrowth').value);
    const years = parseInt(document.getElementById('projectionYears').value);

    const revenueData = calculateRevenue(baseGDP, incomeTax, corporateTax, salesTax, gdpGrowth, years);
    updateVisualization(revenueData, years);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    window.viz = initVisualization();
    initControls();
    
    // Initial visualization
    updateAll();
}); 