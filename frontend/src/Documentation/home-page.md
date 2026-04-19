# HomePage Documentation

This code creates the **HomePage** component for the StreakGrid app. It shows a welcome heading, an animated background, and two cards for login and registration. 

## Imports

```tsx
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
```

- This line imports UI components from **Material UI**. 
- `Box` is a flexible wrapper container, `Button` creates clickable buttons, `Card` and `CardContent` structure content inside cards, and `Typography` is used for styled text. 

```tsx
import { Link } from "react-router-dom";
```

- This imports `Link` from **react-router-dom**. 
- It is used for navigation between pages without reloading the app. 

```tsx
import styles from "../../styles/HomePage/homepage.module.css";
```

- This imports a CSS module file named `homepage.module.css`. 
- The `styles` object lets the component use scoped class names such as `styles.card` or `styles.title`. 

```tsx
import AnimatedBackground from "../../components/AnimatedBackground/AnimatedBackground";
```

- This imports a custom component named `AnimatedBackground`. 
- It is likely responsible for showing a moving or decorative background behind the page content. 

## Button style object

```tsx
const btnSx = {
    width: "100%",
    py: 1.2,
    borderRadius: "8px",
    background: "linear-gradient(135deg, #7c6af7, #5b4fcf)",
    color: "white",
    fontWeight: 700,
    fontSize: 15,
    textTransform: "none",
    "&:hover": { background: "linear-gradient(135deg, #6a58e0, #4a3fbf)" },
};
```

- This creates a reusable style object called `btnSx` for the buttons. 
- `width: "100%"` makes the button take the full width of its parent container. 
- `py: 1.2` adds vertical padding on the top and bottom of the button. 
- `borderRadius: "8px"` gives the button rounded corners. 
- `background: "linear-gradient(135deg, #7c6af7, #5b4fcf)"` applies a purple gradient background. 
- `color: "white"` makes the button text white. 
- `fontWeight: 700` makes the text bold. 
- `fontSize: 15` sets the text size to 15 pixels. 
- `textTransform: "none"` prevents Material UI from automatically converting the text to uppercase. 
- `"&:hover"` defines the hover state, changing the gradient when the user moves the mouse over the button. 

## Component definition

```tsx
export default function HomePage() {
```

- This defines and exports the `HomePage` component as the default export of the file. 
- Because it is the default export, other files can import it without using curly braces. 

```tsx
    return (
```

- This starts the JSX returned by the component. 
- JSX describes what will be shown on the screen. 

## Main container

```tsx
        <Box className={styles["main-box"]}>
```

- This creates the main wrapper for the page using Material UI's `Box`. 
- It applies the CSS module class `main-box` for page-level styling. 

```tsx
            <AnimatedBackground />
```

- This renders the animated background component inside the main container. 
- It helps make the page look more dynamic and visually appealing. 

## Welcome title

```tsx
            <Typography
                variant="h3"
                className={styles.title}
                sx={{ color: "white", fontWeight: 700, textAlign: "center" }}
            >
                Welcome to StreakGrid
            </Typography>
```

- This block displays the main heading of the page. 
- `variant="h3"` gives the text the style of a level-3 heading in Material UI. 
- `className={styles.title}` applies additional CSS module styling from the stylesheet. 
- The `sx` prop adds inline Material UI styles, making the text white, bold, and centered. 
- The actual heading text shown to the user is **Welcome to StreakGrid**. 

## Card group container

```tsx
            <Box className={styles["card-group"]}>
```

- This creates another `Box` that holds the two cards together. 
- The `card-group` class likely controls layout, spacing, or alignment of the cards. 

## Login card

```tsx
                {/* Login */}
```

- This is a JSX comment that labels the next section as the login card. 

```tsx
                <Card
                    className={styles.card}
                    style={{ "--delay": "0.2s" } as React.CSSProperties}
                >
```

- This creates the first card for login. 
- `className={styles.card}` applies the shared card styling from the CSS module. 
- The `style` prop sets a custom CSS variable `--delay` to `0.2s`. 
- `as React.CSSProperties` is a TypeScript type assertion that tells TypeScript this inline style object is valid CSS. 
- The `--delay` variable is often used for animation timing, so this card may appear with a slight delay. 

```tsx
                    <CardContent sx={{ p: 0, width: "100%", textAlign: "center" }}>
```

- This wraps the inside content of the card. 
- `p: 0` removes default padding, `width: "100%"` makes the content area fill the card, and `textAlign: "center"` centers the inner text. 

```tsx
                        <Typography sx={{ color: "#aaa", mb: 2, mt: 1, fontSize: 14 }}>
                            Already have an account?
                        </Typography>
```

- This shows a short message above the login button. 
- The text color is light gray, the font size is 14, `mb: 2` adds bottom margin, and `mt: 1` adds top margin. 
- The message displayed is **Already have an account?** 

```tsx
                        <Link to="/auth/login" className={styles.link}>
```

- This creates a navigation link to the login route `/auth/login`. 
- `className={styles.link}` applies styling to the link element. 

```tsx
                            <Button sx={btnSx}>Login</Button>
```

- This renders the login button inside the link. 
- The button uses the shared `btnSx` styles, so it will match the design defined earlier. 
- Clicking it takes the user to the login page because it is wrapped inside the `Link`. 

```tsx
                        </Link>
                    </CardContent>
                </Card>
```

- These lines close the `Link`, `CardContent`, and `Card` elements for the login section. 

## Register card

```tsx
                {/* Register */}
```

- This is a JSX comment marking the start of the register card section. 

```tsx
                <Card
                    className={styles.card}
                    style={{ "--delay": "0.4s" } as React.CSSProperties}
                >
```

- This creates the second card for registration. 
- It uses the same card class as the login card, so both cards have a similar design. 
- Here the custom CSS variable `--delay` is set to `0.4s`, which suggests this card may animate slightly later than the first one. 

```tsx
                    <CardContent sx={{ p: 0, width: "100%", textAlign: "center" }}>
```

- This adds the content wrapper inside the register card. 
- It uses the same styling approach as the login card content. 

```tsx
                        <Typography sx={{ color: "#aaa", mb: 2, mt: 1, fontSize: 14 }}>
                            New here? Join us today.
                        </Typography>
```

- This shows a short message for new users. 
- The text styling is the same as the previous card, which keeps the design consistent. 
- The displayed message is **New here? Join us today.** 

```tsx
                        <Link to="/auth/register" className={styles.link}>
```

- This creates a navigation link to the registration page at `/auth/register`. 
- The same link class is reused for consistent styling. 

```tsx
                            <Button sx={btnSx}>Register</Button>
```

- This renders the register button. 
- It uses the same reusable button style object, so both buttons look the same except for their text. 
- Clicking it takes the user to the registration page. 

```tsx
                        </Link>
                    </CardContent>
                </Card>
```

- These lines close the `Link`, `CardContent`, and `Card` for the register section. 

## Closing structure

```tsx
            </Box>
        </Box>
    );
}
```

- The first `</Box>` closes the card group container. 
- The second `</Box>` closes the main page container. 
- `);` ends the returned JSX, and `}` ends the `HomePage` function. 

## What this page does

- Shows an animated homepage with a welcome title. 
- Displays two action cards, one for existing users and one for new users. 
- Uses reusable button styling to keep the UI consistent. 
- Navigates to `/auth/login` and `/auth/register` using React Router links. 