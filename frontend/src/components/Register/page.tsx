import { Box, Button, Card, CardContent, FormControl, FormLabel, IconButton, Input, Link, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import styles from "../../styles/Register/register.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser } from "../../store/slices/authSlice";
import { selectAuthLoading, selectAuthError } from "../../store/selectors/authSelectors";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";

const labelSx = { color: "#ccc", fontWeight: 600, mb: "4px", mt: "8px", fontSize: 13 };

export default function RegisterPage() {
    const [user, setUser] = React.useState({ name: "", email: "", password: "", confirmPassword: "" });

    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAuthLoading);
    const serverError = useAppSelector(selectAuthError);
    const [localError, setLocalError] = React.useState("");

    const error = localError || serverError;

    const navigate = useNavigate();

    const handleRegister = () => {
        if (!user.name || !user.email || !user.password || !user.confirmPassword) {
            setLocalError("All fields are required");
            return;
        }
        if (user.password !== user.confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }
        setLocalError("");
        dispatch(registerUser({ name: user.name, email: user.email, password: user.password }));
    };

    return (
        <Box className={styles["main-box"]}>
            <AnimatedBackground />
            <Card className={styles["main-card"]}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <IconButton
                            onClick={() => navigate(-1)}
                            sx={{ color: "#aaa", "&:hover": { color: "#7c6af7" } }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5" sx={{ color: "white", fontWeight: 700, flex: 1, textAlign: "center", pr: "40px" }}>
                            Create account
                        </Typography>
                    </Box>

                    <FormControl fullWidth>
                        <FormLabel sx={labelSx}>Name</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter your name"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                            className={styles["input-field"]}
                            fullWidth
                        />

                        <FormLabel sx={labelSx}>Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className={styles["input-field"]}
                            fullWidth
                        />

                        <FormLabel sx={labelSx}>Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className={styles["input-field"]}
                            fullWidth
                        />

                        <FormLabel sx={labelSx}>Confirm Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Confirm your password"
                            value={user.confirmPassword}
                            onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                            className={styles["input-field"]}
                            fullWidth
                        />
                    </FormControl>

                    {error && (
                        <Typography sx={{ color: "#f44336", mt: 1, fontSize: 13 }}>
                            {error}
                        </Typography>
                    )}

                    <Button
                        fullWidth
                        onClick={handleRegister}
                        disabled={loading}
                        sx={{
                            mt: 3,
                            py: 1.2,
                            borderRadius: "8px",
                            background: "linear-gradient(135deg, #7c6af7, #5b4fcf)",
                            color: "white",
                            fontWeight: 700,
                            fontSize: 15,
                            textTransform: "none",
                            "&:hover": { background: "linear-gradient(135deg, #6a58e0, #4a3fbf)" },
                            "&:disabled": { background: "#444", color: "#888" },
                        }}
                    >
                        {loading ? "Registering..." : "Register"}
                    </Button>

                    <Typography className={styles.text}>
                        Already have an account?
                        <Link className={styles.link} sx={{ ml: "6px" }} href="/auth/login">
                            Login
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
