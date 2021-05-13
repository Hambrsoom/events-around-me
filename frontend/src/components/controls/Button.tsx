import { Button as MuiButton } from "@material-ui/core";

export default function Button(props: any) {
    const {text, color, variant, onClick, ...other} = props;
    
    return (
        <MuiButton
            variant= {variant || "contained"}
            color={color}
            onClick= {onClick}
            {...other}
        >
            {text}
        </MuiButton>
    )
}
