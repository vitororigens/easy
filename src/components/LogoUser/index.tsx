import { Container, Title } from "./styles";


type LogoUserProps = {
    title: string;
}

export function LogoUser({ title }: LogoUserProps) {
    function getInitials(name: string): string {
        const nameArray = name.split(" ");
        const initials = nameArray.map(word => word.charAt(0).toUpperCase()).join("");
        return initials;
    }

    return (
        <Container>
            <Title>{getInitials(title)}</Title>
        </Container>
    )
}
