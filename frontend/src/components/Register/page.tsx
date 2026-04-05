import { Box, Button, Card, CardContent, FormControl, FormLabel, Input, Link, Typography } from "@mui/material";
import React from "react";
import styles from "../../styles/Register/register.module.css";

export default function RegisterPage() {
    const [user, setUser] = React.useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = React.useState("");

    const handleRegister = () => {
        // 🔴 Empty field validation
        if (!user.name || !user.email || !user.password || !user.confirmPassword) {
            setError("All fields are required");
            return;
        }

        // 🔴 Password match validation
        if (user.password !== user.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // ✅ Clear error
        setError("");

        console.log("User Data:", user);

        // 👉 Call API here
    };

    return (
        <Box className={styles["main-box"]}>
            <Card className={styles["main-card"]}>
                <CardContent>
                    <FormControl>

                        <FormLabel sx={labelStyle}>Name</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter your name"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                            className={styles["input-field"]}
                        />

                        <FormLabel sx={labelStyle}>Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className={styles["input-field"]}
                        />

                        <FormLabel sx={labelStyle}>Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className={styles["input-field"]}
                        />

                        <FormLabel sx={labelStyle}>Confirm Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Enter your password again"
                            value={user.confirmPassword}
                            onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                            className={styles["input-field"]}
                        />

                    </FormControl>

                    {/* 🔴 Error Message */}
                    {error && (
                        <Typography sx={{ color: "red", mt: 1 }}>
                            {error}
                        </Typography>
                    )}

                    <Button 
                        className={styles.registerButton}
                        onClick={handleRegister}
                    >
                        Register
                    </Button>

                    <Typography className={styles.text}>
                        Already have an account
                        <Link
                            className={styles.link}
                            sx={{ marginLeft: "4px" }}
                            href="/auth/login"
                        >
                            Login
                        </Link>
                    </Typography>

                </CardContent>
            </Card>
        </Box>
    );
}

// ✅ Reusable style (cleaner code)
const labelStyle = {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "2px",
    marginLeft: "2px",
};