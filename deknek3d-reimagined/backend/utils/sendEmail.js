const sendEmail = async ({ to, subject, text }) => {
	return {
		delivered: false,
		to,
		subject,
		text,
		note: "Email provider not configured in this starter server.",
	};
};

export default sendEmail;

