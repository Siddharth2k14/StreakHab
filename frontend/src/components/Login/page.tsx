import React from "react";
import CardContent from "@mui/joy/CardContent";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";

import styles from "../../styles/Login/login.module.css";

export default function LoginPage() {
    const [user, setUser] = React.useState({
        password: "",
        email: ""
    });

    const [error, setError] = React.useState("");

    const handleLogin = () => {
        if (!user.email || !user.password) {
            setError("Please fill all fields");
            return;
        }

        setError(""); // clear error
        console.log("Login Data:", user);

        // proceed with API call here
    };

    return (
        <Box className={styles["main-box"]}>
            <Card className={styles["main-card"]}>
                <CardContent>
                    <FormControl>
                        <FormLabel sx={{
                            color: "black",
                            fontWeight: "bold",
                            textAlign: "center",
                            marginTop: "2px",
                            marginLeft: "2px",
                        }}>Email</FormLabel>

                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className={styles["input-field"]}
                        />

                        <FormLabel sx={{
                            color: "black",
                            fontWeight: "bold",
                            textAlign: "center",
                            marginTop: "2px",
                            marginLeft: "2px",
                        }}>Password</FormLabel>

                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className={styles["input-field"]}
                        />
                    </FormControl>

                    {/* 🔴 Error Message */}
                    {error && (
                        <Typography sx={{ color: "red", mt: 1 }}>
                            {error}
                        </Typography>
                    )}

                    <Button className={styles.loginButton} onClick={handleLogin}>
                        Login
                    </Button>

                    <Typography className={styles.text}>
                        Do not have an account
                        <Link
                            className={styles.link}
                            sx={{ marginLeft: "4px" }}
                            href="/auth/register"
                        >
                            Register
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}