const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/calculate', (req, res) => {
    const { name, mobile, address, billingunit, month, units, payment } = req.body;

    // Electricity rates
    const FIRST_50_UNITS_RATE = 3.50;
    const NEXT_100_UNITS_RATE = 4.00;
    const NEXT_100_UNITS_ABOVE_RATE = 5.20;
    const ABOVE_250_UNITS_RATE = 6.50;

    // Calculate the bill
    let bill = 0;
    if (units <= 50) {
        bill = units * FIRST_50_UNITS_RATE;
    } else if (units <= 150) {
        bill = 50 * FIRST_50_UNITS_RATE + (units - 50) * NEXT_100_UNITS_RATE;
    } else if (units <= 250) {
        bill = 50 * FIRST_50_UNITS_RATE + 100 * NEXT_100_UNITS_RATE + (units - 150) * NEXT_100_UNITS_ABOVE_RATE;
    } else {
        bill = 50 * FIRST_50_UNITS_RATE + 100 * NEXT_100_UNITS_RATE + 100 * NEXT_100_UNITS_ABOVE_RATE + (units - 250) * ABOVE_250_UNITS_RATE;
    }

    // Generate the bill content
    const currentDate = new Date().toISOString();
    const billContent = `Name: ${name}
Mobile Number: ${mobile}
Address: ${address}
Billing Unit Number: ${billingunit}

Year and Month: ${month}

Total Units Consumed: ${units}
Payment Method: ${payment}
Total Bill Amount: Rs. ${bill.toFixed(2)}

Bill Generated On: ${currentDate}
`;

    // Save the bill to a file
    const filename = 'public/electricity_bill.txt';
    fs.writeFileSync(filename, billContent);

    // Display the result and bill link
    res.send(`Bill generated and saved as: <a href="/electricity_bill.txt" download>Download Bill</a>`);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
