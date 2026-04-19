import React from "react";
import { Box, Button, Card, CardContent, FormControl, FormLabel, IconButton, Input, Link, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "../../styles/Login/login.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser } from "../../store/slices/authSlice";
import { selectAuthLoading, selectAuthError } from "../../store/selectors/authSelectors";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";

const labelSx = { color: "#ccc", fontWeight: 600, mb: "4px", mt: "8px", fontSize: 13 };

export default function LoginPage() {
    const [user, setUser] = React.useState({ email: "", password: "" });

    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAuthLoading);
    const serverError = useAppSelector(selectAuthError);
    const [localError, setLocalError] = React.useState("");

    const error = localError || serverError;

    const navigate = useNavigate();

    const handleLogin = () => {
        if (!user.email || !user.password) {
            setLocalError("Please fill all fields");
            return;
        }
        setLocalError("");
        dispatch(loginUser(user));
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
                            Welcome back
                        </Typography>
                    </Box>

                    <FormControl fullWidth>
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
                    </FormControl>

                    {error && (
                        <Typography sx={{ color: "#f44336", mt: 1, fontSize: 13 }}>
                            {error}
                        </Typography>
                    )}

                    <Button
                        fullWidth
                        onClick={handleLogin}
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
                        {loading ? "Logging in..." : "Login"}
                    </Button>

                    <Typography className={styles.text}>
                        Don't have an account?
                        <Link className={styles.link} sx={{ ml: "6px" }} href="/auth/register">
                            Register
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
