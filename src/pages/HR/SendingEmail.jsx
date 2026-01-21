export function sendMailGmail(emp) {
  const email = "funfact1810@gmail.com";
  const subject = "Employee Payslip";

  const body = `
Employee ID: ${emp.employeeId}

Hello ${emp.name},

Please find your salary details for this month below:

Base Salary: ₹${emp.BaseSalary}

Thank you for your continued dedication and hard work.
We truly appreciate your valuable contribution to the team.

Regards,
HR Team
`;

  const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  // 🔥 Guaranteed redirect
  window.location.href = gmailURL;
}
