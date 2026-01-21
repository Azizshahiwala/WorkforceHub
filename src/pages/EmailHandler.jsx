export function sendPaySlip(emailTo,empName,empID,salBreakup,subject) {
  const body = `
Employee ID: ${empID}

Hello ${empName},

Please find your salary details for this month below:

Base Salary: ₹${salBreakup.BaseSalary}
Days Worked: ${salBreakup.daysWorked}
Tax Deducted: ₹${salBreakup.TaxAmount}
Provident fund:₹${salBreakup.ProvidentFund}
Professional Tax:₹${salBreakup.ProfessionalTax}
Gross Pay: ₹${salBreakup.GrossSalary}
Loss Of Pay: ₹${salBreakup.LossOfPay}
---------------------------------------------
Net Take-Home: ₹${salBreakup.NetSalary}

Thank you for your continued dedication and hard work.
We truly appreciate your valuable contribution to the team.

Regards,
Workforce team

Do not reply to this email.
`;

  const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailTo}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = gmailURL;
}
