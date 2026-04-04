import React from "react"
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { Input } from "@mui/joy";

export default function LoginPage() {
    const [user, setUser] = React.useState({
        password: "",
        email: ""
    })

    return (
        <Box>
            <Card>
                <CardContent>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />

                        <FormLabel>Password</FormLabel>
                        <Input 
                            
                        />
                    </FormControl>
                </CardContent>
            </Card>
        </Box>
    )
}