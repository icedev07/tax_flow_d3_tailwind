// Constants for calculations
const BASE_GDP = 1000000; // Base GDP in millions
const YEARS = 10; // Number of years to project

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
        .domain([0, YEARS - 1])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, BASE_GDP * 0.5]) // Assuming max revenue is 50% of GDP
        .range([height, 0]);

    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(YEARS).tickFormat(d => `Year ${d + 1}`));

    svg.append('g')
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `$${(d/1000000).toFixed(1)}B`));

    // Add axis labels
    svg.append('text')
        .attr('transform', `translate(${width/2}, ${height + margin.bottom - 5})`)
        .style('text-anchor', 'middle')
        .text('Year');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -(height / 2))
        .style('text-anchor', 'middle')
        .text('Revenue (Billions)');

    return { svg, xScale, yScale, width, height };
}

// Calculate revenue based on tax rates and GDP growth
function calculateRevenue(incomeTax, corporateTax, salesTax, gdpGrowth) {
    const revenue = [];
    let currentGDP = BASE_GDP;

    for (let year = 0; year < YEARS; year++) {
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
function updateVisualization(revenue) {
    const { svg, xScale, yScale, width, height } = window.viz;

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
    const controls = ['incomeTax', 'corporateTax', 'salesTax', 'gdpGrowth'];
    
    controls.forEach(control => {
        const input = document.getElementById(control);
        const valueDisplay = document.getElementById(control + 'Value');
        
        input.addEventListener('input', function() {
            valueDisplay.textContent = this.value + '%';
            updateVisualization(calculateRevenue(
                parseFloat(document.getElementById('incomeTax').value),
                parseFloat(document.getElementById('corporateTax').value),
                parseFloat(document.getElementById('salesTax').value),
                parseFloat(document.getElementById('gdpGrowth').value)
            ));
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    window.viz = initVisualization();
    initControls();
    
    // Initial visualization
    updateVisualization(calculateRevenue(
        parseFloat(document.getElementById('incomeTax').value),
        parseFloat(document.getElementById('corporateTax').value),
        parseFloat(document.getElementById('salesTax').value),
        parseFloat(document.getElementById('gdpGrowth').value)
    ));
}); 