var states = [];
var products = [];
var dataSet = [];
var categories = [];
var currentYear;
var currentMonth;
var currentWeek;

$(document).ready(function() {
    (async () => {
        var data = await d3.csv("project-data-uche.csv");
        readData(data);
    })();

    $("#age-range-dropdown").change(function() {
        var selection = $(this)
            .children("option:selected")
            .val();
        if (selection != "selectValue") {
            var minimumAge = parseInt(selection.split("-")[0]);
            var maximumAge = parseInt(selection.split("-")[1]);
            fetchTopTeoWithAgeRange(minimumAge, maximumAge, dataSet);
        }
    });

    $("#gender-range-dropdown").change(function() {
        var sex = $(this)
            .children("option:selected")
            .val();
        if (sex != "selectValue") {
            fetchTopTeoWithGender(sex, dataSet);
        }
    });

    $("#location-range-dropdown").change(function() {
        var state = $(this)
            .children("option:selected")
            .val();
        if (state != "selectValue") {
            fetchTopTeoWithState(state, dataSet);
        }
    });

    $("#year-range-dropdown").change(function() {
        var year = $(this)
            .children("option:selected")
            .val();
        if (year == "yearSelectValue") {
            $("#month-range-dropdown").prop("disabled", true);
            $("#week-range-dropdown").prop("disabled", true);
        } else {
            $("#month-range-dropdown").prop("disabled", false);
            $("#week-range-dropdown").prop("disabled", true);
        }
    });

    $("#month-range-dropdown").change(function() {
        var month = $(this)
            .children("option:selected")
            .val();
        if (month == "monthSelectValue") {
            $("#week-range-dropdown").prop("disabled", true);
        } else {
            $("#week-range-dropdown").prop("disabled", false);
        }
    });

    $("#year-range-dropdown").change(function() {
        var year = $(this)
            .children("option:selected")
            .val();
        currentYear = year;
        if (year != "yearSelectValue") {
            fetchTopFiveProductsByYear(year, dataSet);
        }
    });

    $("#month-range-dropdown").change(function() {
        var month = $(this)
            .children("option:selected")
            .val();
        currentMonth = month;
        if (month != "monthSelectValue") {
            fetchTopFiveProductsByMonth(currentYear, month, dataSet);
        }
    });
    
    $("#week-range-dropdown").change(function() {
        var week = $(this)
            .children("option:selected")
            .val();
        currentWeek = week;
        if (week != "weekSelectValue") {
            fetchTopFiveProductsByWeek(currentYear, currentMonth, week, dataSet);
        }
    });
    
    $("#holiday-range-dropdown").change(function() {
        var holidayData = $(this)
            .children("option:selected")
            .val();
        var holidayName = holidayData.split("_")[0];
        var holidayYear = holidayData.split("_")[1];
        
        if (holidayData != "holidaySelectValue") {
            fetchTopFiveProductsByHoliday(holidayYear, holidayName, dataSet);
        }
    });
    
    $("#yearly-sales-range-dropdown").change(function() {
        var year = $(this)
            .children("option:selected")
            .val();
       
        if (year != "yearlySalesSelectValue") {
            fetchSalesPerQuarter(year, dataSet);
        }
    });
    
    
    $("#mvl-range").change(function() {
        var category = $(this)
            .children("option:selected")
            .val();
       
        if (category != "mvlSelectValue") {
            mostPopularVsLeastPopularInACategory(category, dataSet);
        }
    });
    
    
    
    
           
    
    
});

function readData(data) {
    fetchStates(data);
    fetchProduct(data);
    fetchCategories(data);
    dataSet = data;

    const option = {
        format: "d",
        ylabel: "Quantity",
        title: " most popular against least popular"
    };
    var samplData = [
        { label: "Electronics", value: 8 },
        { label: "Computing", value: 13 },
        { label: "Fashion", value: 10 },
        { label: "Gaming", value: 4 }
    ];

    demographicAgeData(data);
    demographicGenderData(data);
    demographicStateData(data);
    fetchSalesPerYear(data)
    console.log(categories);
    
}

function fetchStates(data) {
    data.forEach(row => {
        if (!states.includes(row.state)) {
            states.push(row.state);
        }
    });
    showStates();
}

function fetchProduct(data) {
    data.forEach(row => {
        if (!products.includes(row.product)) {
            products.push(row.product);
        }
    });
}

function fetchCategories(data) {
    data.forEach(row => {
        if (!categories.includes(row.category)) {
            categories.push(row.category);
        }
    });
}

function fetchAges(data) {
    data.forEach(row => {
        if (!ages.includes(row.age)) {
            ages.push(row.age);
        }
    });
}

function fetchSex(data) {
    data.forEach(row => {
        if (!sexes.includes(row.sex)) {
            sexes.push(row.sex);
        }
    });
}

function showStates() {
    states.sort();
    $.each(states, function(index, state) {
        var stateOption = `<option value ="${state}"> ${capitalizeFirstLetter(
            state
        )}</option>`;
        $("#location-range-dropdown").append(stateOption);
    });
}

function demographicAgeData(dataSet) {
    var ageRanges = ["17-40", "41-70"];
    var ageCount = [0, 0];
    ageRanges.forEach((range) => {
       
    });
    
    for(let i = 0; i < ageRanges.length; i++){
        dataSet.forEach(dataSetRow => {
            var buyerAge = parseInt(dataSetRow.age);
            if (
                buyerAge >= parseInt(ageRanges[i].split("-")[0]) &&
                buyerAge <= parseInt(ageRanges[i].split("-")[1])
            ) {
                ageCount[i] = ageCount[i]+1;
            }
        }); 
    }
    
    var output = [];
    
    for(let i = 0; i < ageRanges.length; i++) {
        output.push({
            label: ageRanges[i],
            value: ageCount[i]
        });
    }

    const option = {
        format: "d",
        ylabel: "Quantity",
        title: " most popular items"
    };
    

    drawDonutChart({
        data: output,
        selector: "#demographic-by-age svg",
        option: option
    });


    console.log();
}

function demographicGenderData(dataSet) {
    var genders = ["male", "female"];
    var genderCount = [0, 0];
    genders.forEach((range) => {
       
    });
    
    for(let i = 0; i < genders.length; i++){
        dataSet.forEach(dataSetRow => {
            var buyerGender = (dataSetRow.sex);
            if (
                buyerGender == (genders[i]) 
            ) {
                genderCount[i] = genderCount[i]+1;
            }
        }); 
    }
    
    var output = [];
    
    for(let i = 0; i < genders.length; i++) {
        output.push({
            label: genders[i],
            value: genderCount[i]
        });
    }

    const option = {
        format: "d",
        ylabel: "Quantity",
        title: " most popular items"
    };
    

    drawDonutChart({
        data: output,
        selector: "#demographic-by-gender svg",
        option: option
    });


    console.log();
}

function fetchTopTeoWithAgeRange(minAge, maxAge, dataSet) {
    var productObject = {};
    products.forEach(product => {
        productObject[product] = 0;
    });
    Object.keys(productObject).forEach(product => {
        dataSet.forEach(dataSetRow => {
            var buyerAge = parseInt(dataSetRow.age);
            if (
                buyerAge >= minAge &&
                buyerAge <= maxAge &&
                dataSetRow.product == product
            ) {
                productObject[product] =
                    productObject[product] + parseInt(dataSetRow.quantity);
            }
        });
    });

    var productCountArray = [];

    for (var productName in productObject) {
        productCountArray.push(productObject[productName]);
    }
    productCountArray.sort((a, b) => b - a);

    var output = fetchTopNElements(productObject, productCountArray, 10);
    var output2 = fetchLastNElements(productObject, productCountArray, 10);

    const option = {
        format: "d",
        ylabel: "Quantity",
        title: " most popular items"
    };

    const option2 = {
        format: "d",
        ylabel: "Quantity",
        title: " least popular items"
    };

    let color = "#5A053E";

    drawBarChart({
        data: output,
        selector: "#top-10-by-age svg",
        option: option,
        color: color
    });

    drawBarChart({
        data: output2,
        selector: "#least-10-by-age svg",
        option: option2,
        color: color
    });

    console.log();
}

function demographicStateData(dataSet) {
    let stateClasses = states.map((country) => {
        return {label: country, value: 0};
    });
    stateClasses.forEach((country) => {
        dataSet.forEach((row) => {
            if(row.state === country.label){
                country.value = country.value + 1;
            }
        })
    })

    drawDonutChart({
        data: stateClasses,
        selector: "#demographic-by-location svg",
        option: {}
    });


    console.log();
}

function fetchSalesPerYear(dataset) {
    let salesPerYear = [{label: 2016, value: 0}, {label: 2017, value: 0}, {label: 2018, value: 0}, {label: 2019, value: 0}]
    
    salesPerYear.forEach((yearlySale) => {
        dataset.forEach((rec) => {
            let sumPrice = parseFloat(rec.total);
            let yearSale = parseInt(rec.purchase_date.split("-")[0]);
            if(yearSale == yearlySale.label) {
                yearlySale.value = parseFloat((yearlySale.value + sumPrice));
            }
        });
    });

    
    

    const option = {
        format: "d",
        ylabel: "Sales",
        title: "Sales per year"
    };

    let color = "#daed73";

    drawBarChart({
        data: salesPerYear,
        selector: "#sale-by-year svg",
        option: option,
        color: color
    });

    console.log();
}

function fetchSalesPerQuarter(year, dataset) {
    year = parseInt(year);
    let salesPerQuarter = [{name:"q1", value:1, amount:0}, {name:"q2", value: 2, amount:0}, {name:"q3", value:3, amount:0}, {name:"q4", value:4, amount:0}];
        
    salesPerQuarter.forEach((yearQuarter) => {
        
        dataset.forEach((rec) => {
            let sumPrice = parseFloat(rec.total);
            let yearSale = parseInt(rec.purchase_date.split("-")[0]);
            let month = parseInt(rec.purchase_date.split("-")[1]);
            
            var isQuarter = quarterCheker(month, yearQuarter.value)
            if(yearSale == year && isQuarter) {
                yearQuarter.amount =  yearQuarter.amount + sumPrice;
            }
        });
    });

    
    var output=[{label: "q1", value: salesPerQuarter[0].amount}, {label: "q2", value: salesPerQuarter[1].amount}, {label: "q3", value: salesPerQuarter[2].amount}, {label: "q4", value: salesPerQuarter[3].amount}];
    
    

    const option = {
        format: "d",
        ylabel: "Sales",
        title: "Sales per Quarter"
    };

    let color = "#e60e7a";

    drawBarChart({
        data: output,
        selector: "#sale-by-quarter svg",
        option: option,
        color: color
    });

    console.log();
}

function mostPopularVsLeastPopularInACategory(category, dataSet) {
    var productObject = {};
    products.forEach(product => {
        productObject[product] = 0;
    });
    Object.keys(productObject).forEach(product => {
        dataSet.forEach(dataSetRow => {
            var buyerCategory = dataSetRow.category;
            if (buyerCategory == category && dataSetRow.product == product) {
                productObject[product] =
                    productObject[product] + parseInt(dataSetRow.quantity);
            }
        });
    });

    var productCountArray = [];
    
    var maximum = {label: "" , value:0};
    var minimum = {label: "" , value:0};
    
    Object.keys(productObject).forEach((key) => {
        if(productObject[key] > maximum.value) {
            maximum.label = key;
            maximum.value = productObject[key];
        }
    });

    minimum.label = maximum.label;
    minimum.value = maximum.value;
    
    Object.keys(productObject).forEach((key) => {
        if(productObject[key] < minimum.value && productObject[key] > 0) {
            minimum.label = key;
            minimum.value = productObject[key];
        }
    });

    var output = [maximum, minimum];

    const option = {
        format: "d",
        ylabel: "Quantity",
        title: " most popular items"
    };

   
    let color = "#0f100d";

    drawBarChart({
        data: output,
        selector: "#top-vs-least-by-category svg",
        option: option,
        color: color
    });

    
    console.log();
}

function fetchTopTeoWithGender(sex, dataSet) {
    var productObject = {};
    products.forEach(product => {
        productObject[product] = 0;
    });
    Object.keys(productObject).forEach(product => {
        dataSet.forEach(dataSetRow => {
            var buyerSex = dataSetRow.sex;
            if (buyerSex == sex && dataSetRow.product == product) {
                productObject[product] =
                    productObject[product] + parseInt(dataSetRow.quantity);
            }
        });
    });

    var productCountArray = [];

    for (var productName in productObject) {
        productCountArray.push(productObject[productName]);
    }
    productCountArray.sort((a, b) => b - a);

    var output = fetchTopNElements(productObject, productCountArray, 10);
    var output2 = fetchLastNElements(productObject, productCountArray, 10);

    const option = {
        format: "d",
        ylabel: "Quantity",
        title: " most popular items"
    };

    const option2 = {
        format: "d",
        ylabel: "Quantity",
        title: " least popular items"
    };

    let color = "#7A5A09";

    drawBarChart({
        data: output,
        selector: "#top-10-by-gender svg",
        option: option,
        color: color
    });

    drawBarChart({
        data: output2,
        selector: "#least-10-by-gender svg",
        option: option2,
        color: color
    });

    console.log();
}

function fetchTopTeoWithState(state, dataSet) {
    var productObject = {};
    products.forEach(product => {
        productObject[product] = 0;
    });
    Object.keys(productObject).forEach(product => {
        dataSet.forEach(dataSetRow => {
            var buyerState = dataSetRow.state;
            if (buyerState == state && dataSetRow.product == product) {
                productObject[product] =
                    productObject[product] + parseInt(dataSetRow.quantity);
            }
        });
    });

    var productCountArray = [];

    for (var productName in productObject) {
        productCountArray.push(productObject[productName]);
    }
    productCountArray.sort((a, b) => b - a);

    var output = fetchTopNElements(productObject, productCountArray, 10);
    var output2 = fetchLastNElements(productObject, productCountArray, 10);

    const option = {
        format: "d",
        ylabel: "Quantity",
        title: " most popular items"
    };

    const option2 = {
        format: "d",
        ylabel: "Quantity",
        title: " least popular items"
    };

    let color = "#085C5B    ";

    drawBarChart({
        data: output,
        selector: "#top-10-by-location svg",
        option: option,
        color: color
    });

    drawBarChart({
        data: output2,
        selector: "#least-10-by-location svg",
        option: option2,
        color: color
    });

    console.log();
}

function fetchTopFiveProductsByYear(year, dataSet) {
    var productObject = {};
    products.forEach(product => {
        productObject[product] = 0;
    });
    Object.keys(productObject).forEach(product => {
        dataSet.forEach(dataSetRow => {
            var purchaseYear = dataSetRow.purchase_date.split("-")[0];
            if (purchaseYear == year && dataSetRow.product == product) {
                productObject[product] =
                    productObject[product] + parseInt(dataSetRow.quantity);
            }
        });
    });

    var productCountArray = [];

    for (var productName in productObject) {
        productCountArray.push(productObject[productName]);
    }
    productCountArray.sort((a, b) => b - a);

    var output = fetchTopNElements(productObject, productCountArray, 5);

    const option = {
        format: "d",
        ylabel: "Quantity",
        title: " most popular items"
    };

    let color = "#05640D";

    drawBarChart({
        data: output,
        selector: "#top-5-by-year svg",
        option: option,
        color: color
    });

    console.log();
}

function fetchTopFiveProductsByMonth(year, month, dataSet) {
    var productObject = {};
    products.forEach(product => {
        productObject[product] = 0;
    });
    Object.keys(productObject).forEach(product => {
        dataSet.forEach(dataSetRow => {
            var purchaseYear = dataSetRow.purchase_date.split("-")[0];
            var purchaseMonth = dataSetRow.purchase_date.split("-")[1];
            if (
                purchaseYear == year &&
                purchaseMonth == month &&
                dataSetRow.product == product
            ) {
                productObject[product] =
                    productObject[product] + parseInt(dataSetRow.quantity);
            }
        });
    });

    var productCountArray = [];

    for (var productName in productObject) {
        productCountArray.push(productObject[productName]);
    }
    productCountArray.sort((a, b) => b - a);

    var output = fetchTopNElements(productObject, productCountArray, 5);

    const option = {
        format: "d",
        ylabel: "Quantity",
        title: " most popular items"
    };

    let color = "#1a0a5d";

    drawBarChart({
        data: output,
        selector: "#top-5-by-month svg",
        option: option,
        color: color
    });

    console.log();
}

function fetchTopFiveProductsByWeek(year, month, week, dataSet) {
    var productObject = {};
    products.forEach(product => {
        productObject[product] = 0;
    });
    Object.keys(productObject).forEach(product => {
        dataSet.forEach(dataSetRow => {
            var purchaseYear = dataSetRow.purchase_date.split("-")[0];
            var purchaseMonth = dataSetRow.purchase_date.split("-")[1];
            var purchaseWeek = fetchWeek(dataSetRow.purchase_date.split("-")[2]);
            if (
                purchaseYear == year &&
                purchaseMonth == month &&
                purchaseWeek == week &&
                dataSetRow.product == product
            ) {
                productObject[product] =
                    productObject[product] + parseInt(dataSetRow.quantity);
            }
        });
    });

    var productCountArray = [];

    for (var productName in productObject) {
        productCountArray.push(productObject[productName]);
    }
    productCountArray.sort((a, b) => b - a);

    var output = fetchTopNElements(productObject, productCountArray, 5);

    const option = {
        format: "d",
        ylabel: "Quantity",
        title: " most popular items"
    };

    let color = "rgba(92, 108, 5, 0.92)";

    drawBarChart({
        data: output,
        selector: "#top-5-by-week svg",
        option: option,
        color: color
    });

    console.log();
}

function fetchTopFiveProductsByHoliday(year, holiday, dataSet) {
    var productObject = {};
    products.forEach(product => {
        productObject[product] = 0;
    });
    Object.keys(productObject).forEach(product => {
        dataSet.forEach(dataSetRow => {
            var purchaseYear = dataSetRow.purchase_date.split("-")[0];
            var purchaseDate = dataSetRow.purchase_date;
            
            
            if (
                purchaseYear == year &&
                isChristmas(purchaseDate) &&
                dataSetRow.product == product
            ) {
                productObject[product] =
                    productObject[product] + parseInt(dataSetRow.quantity);
            }
        });
    });

    var productCountArray = [];

    for (var productName in productObject) {
        productCountArray.push(productObject[productName]);
    }
    productCountArray.sort((a, b) => b - a);

    var output = fetchTopNElements(productObject, productCountArray, 5);

    const option = {
        format: "d",
        ylabel: "Quantity",
        title: " most popular items"
    };

    let color = "rgba(150, 70, 51, 0.92)";

    drawBarChart({
        data: output,
        selector: "#top-5-by-holiday svg",
        option: option,
        color: color
    });

    console.log();
}

function fetchTopNElements(productObject, sortedValues, nElements) {
    var output = [];
    var itemsAlreadyAdded = [];
    for (var i = 0; i < nElements; i++) {
        for (var product in productObject) {
            if (
                productObject[product] == sortedValues[i] &&
                !itemsAlreadyAdded.includes(product)
            ) {
                var outputObject = { label: product, value: sortedValues[i] };
                output.push(outputObject);
                itemsAlreadyAdded.push(product);
            }
        }
    }
    return output;
}

function fetchLastNElements(productObject, sortedValues, nElements) {
    var output2 = [];
    var itemsAlreadyAdded = [];

    for (
        var i = sortedValues.length;
        i > sortedValues.length - nElements;
        i--
    ) {
        for (var product in productObject) {
            if (
                productObject[product] == sortedValues[i - 1] &&
                !itemsAlreadyAdded.includes(product)
            ) {
                var outputObject = {
                    label: product,
                    value: sortedValues[i - 1]
                };
                output2.push(outputObject);
                itemsAlreadyAdded.push(product);
            }
        }
    }
    return output2;
}

const drawBarChart = ({ data, selector, option, color }) => {
    $(selector).html("");

    const barHeight = 25;
    const margin = { top: 80, right: 0, bottom: 20, left: 140 },
        width = $(selector).width() - margin.left - margin.right,
        height =
            Math.ceil((data.length + 0.1) * barHeight) +
            margin.top +
            margin.bottom;

    const svg = d3.select(selector).attr("viewBox", [0, 0, width, height]);

    const x = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([margin.left, width - margin.right]);
    const y = d3
        .scaleBand()
        .domain(d3.range(data.length))
        .rangeRound([margin.top, height - margin.bottom])
        .padding(0.1);

    const xAxis = g =>
        g
            .attr("transform", `translate(0,${margin.top})`)
            .call(d3.axisTop(x).ticks(width / 80, option.format))
            .call(g => g.select(".domain").remove())
            .call(g =>
                g
                    .select(".tick:first-of-type text")
                    .clone()
                    .attr("x", 0)
                    .attr("y", -30)
                    .attr("text-anchor", "start")
                    .attr("font-weight", "bold")
                    .attr("fill", "currentColor")
                    .text(option.yLabel)
            );
    const yAxis = g =>
        g
            .attr("transform", `translate(${margin.left},0)`)
            .call(
                d3
                    .axisLeft(y)
                    .tickFormat(i => data[i].label)
                    .tickSizeOuter(0)
            )
            .call(g => g.selectAll("text").attr("transform", "rotate(10)"));

    const format = x.tickFormat(20, option.format);

    svg.append("g")
        .attr("fill", color)
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", x(0))
        .attr("y", (d, i) => y(i))
        .attr("width", d => x(d.value) - x(0))
        .attr("height", y.bandwidth());
    svg.append("g")
        .attr("fill", "white")
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif")
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("x", d => x(d.value) - 4)
        .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => format(d.value));
    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
    svg.append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", margin.top / 3)
        .attr("text-anchor", "middle")
        .text(option.title);
};

const drawColumnChart = ({ data, selector, option }) => {
    $(selector).html("");

    const margin = { top: 80, right: 20, bottom: 20, left: 60 },
        width = $(selector).width() - margin.left - margin.right,
        height = $(selector).height() - margin.top - margin.bottom;

    const svg = d3.select(selector).attr("viewBox", [0, 0, width, height]);

    const x = d3
        .scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const xAxis = g =>
        g.attr("transform", `translate(0,${height - margin.bottom})`).call(
            d3
                .axisBottom(x)
                .tickFormat(i => data[i].label)
                .tickSizeOuter(0)
        );
    const yAxis = g =>
        g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, option.format))
            .call(g =>
                g
                    .select(".tick:last-of-type text")
                    .clone()
                    .attr("x", -20)
                    .attr("y", -20)
                    .attr("text-anchor", "start")
                    .attr("font-weight", "bold")
                    .attr("fill", "currentColor")
                    .text(option.yLabel)
            );

    svg.append("g")
        .attr("fill", "pink")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth());
    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
    svg.append("text")
        .attr("class", "title")
        .attr("x", width)
        .attr("y", margin.top / 4)
        .attr("text-anchor", "middle")
        .text(option.title);
};

function capitalizeFirstLetter(word) {
    return word.substr(0, 1).toUpperCase() + word.substr(1).toLocaleLowerCase();
}

function fetchWeek(day){
    var week = ""
    day = parseInt(day);
    if(day >0 && day<8){
          week = "1"; 
    }
    else if(day >7 && day<15) {
        week = "2";
    }
    else if(day > 14 && day <22) {
        week = "3";
    }
    else{
        week = "4";
    }
    
    return week;
}

function isChristmas(date) {
    var month = parseInt(date.split("-")[1]);
    var days = parseInt(date.split("-")[2]);
    
    if(month == 12 && days > 14){
        return true;
    }
    else{
        return false;
    }
}

const drawDonutChart = ({ data, selector, option }) => {
  $(selector).html("");

  const margin = { top: 80, right: 20, bottom: 20, left: 80 },
    width = $(selector).width() - margin.left - margin.right,
    height = Math.min(width, 500);

  const svg = d3.select(selector).attr('viewBox', [-width / 2, -height / 2, width, height]);

  const pie = d3
    .pie()
    .padAngle(0.005)
    .sort(null)
    .value((d) => d.value);
  const radius = Math.min(width, height) / 2;
  const arc = d3
    .arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius - 1);
  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.label))
    .range(d3.quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
  const arcs = pie(data);

  svg
    .selectAll('path')
    .data(arcs)
    .join('path')
    .attr('fill', (d) => color(d.data.label))
    .attr('d', arc)
    .append('title')
    .text((d) => `${d.data.label}: ${d.data.value.toLocaleString()}`);

  svg
    .append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 12)
    .attr('text-anchor', 'middle')
    .selectAll('text')
    .data(arcs)
    .join('text')
    .attr('transform', (d) => `translate(${arc.centroid(d)})`)
    .call((text) =>
      text
        .append('tspan')
        .attr('y', '-0.4em')
        .attr('font-weight', 'bold')
        .text((d) => d.data.label)
    )
    .call((text) =>
      text
        .filter((d) => d.endAngle - d.startAngle > 0.25)
        .append('tspan')
        .attr('x', 0)
        .attr('y', '0.7em')
        .attr('fill-opacity', 0.7)
        .text((d) => d.data.value.toLocaleString())
    );
};

const drawLineChart = ({ data, selector, option }) => {
  $(selector).html("");

  const margin = { top: 80, right: 20, bottom: 20, left: 60 },
    width = $(selector).width() - margin.left - margin.right,
    height = $(selector).height() - margin.top - margin.bottom;

  const svg = d3.select(selector).attr('viewBox', [0, 0, width, height]);

  const line = d3
    .line()
    .defined((d) => !isNaN(d.value))
    .x((d) => x(d.label))
    .y((d) => y(d.value));

  const x = d3
    .scaleUtc()
    .domain(d3.extent(data, (d) => d.label))
    .range([margin.left, width - margin.right]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const xAxis = (g) =>
    g.attr('transform', `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom(x)
        .ticks(width / 80)
        .tickSizeOuter(0)
    );
  const yAxis = (g) =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call((g) =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', -20)
          .attr('y', -20)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .attr('fill', 'currentColor')
          .text(option.yLabel)
      );

  svg.append('g').call(xAxis);
  svg.append('g').call(yAxis);
  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#80cbc4')
    .attr('stroke-width', 1.5)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('d', line);
  svg
    .append('text')
    .attr('class', 'title')
    .attr('x', width / 2)
    .attr('y', margin.top / 4)
    .attr('text-anchor', 'middle')
    .text(option.title);
};

function quarterCheker(month, quarter) {
    
    if (month >= 1 && month <=3 && quarter ==1 ) {
        return true;
    }
    else if ( month >= 4 && month <=6 && quarter == 2) {
        return true;
    }
    else if (month >= 7 && month <=9 && quarter ==3){
        return true;
    }
    else if (month >=10 && month <=12 && quarter ==4) {
        return true;
    }
    else {
        return false;
    }
}