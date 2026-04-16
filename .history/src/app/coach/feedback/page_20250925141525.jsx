
"use client";

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';

const FeedbackPage = () => {
	const [form, setForm] = useState({
		name: '',
		email: '',
		feedback: '',
	});

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle feedback submission logic here
		alert('Thank you for your feedback!');
		setForm({ name: '', email: '', feedback: '' });
	};

	return (
		<Container maxWidth="sm">
			<Paper elevation={3} sx={{ p: 4, mt: 6 }}>
				<Typography variant="h4" gutterBottom>
					Coach Feedback
				</Typography>
				<Box component="form" onSubmit={handleSubmit}>
					<TextField
						label="Name"
						name="name"
						value={form.name}
						onChange={handleChange}
						fullWidth
						margin="normal"
						required
					/>
					<TextField
						label="Email"
						name="email"
						value={form.email}
						onChange={handleChange}
						fullWidth
						margin="normal"
						type="email"
						required
					/>
					<TextField
						label="Your Feedback"
						name="feedback"
						value={form.feedback}
						onChange={handleChange}
						fullWidth
						margin="normal"
						multiline
						rows={4}
						required
					/>
					<Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
						Submit
					</Button>
				</Box>
			</Paper>
		</Container>
	);
};

export default FeedbackPage;
