import { Heading, Text, MultiStep, TextInput, Button } from "@ignite-ui/react";
import { Container, Header } from "../style";
import { ArrowRight } from "phosphor-react";
import { ConnectBox, ConnectItem } from "./style";
import { signIn } from "next-auth/react";


export default function Register() {

    // async function getForm() {

    // }

    return (
        <Container>
            <Header>
                <Heading as="strong">
                    Conecte sua agenda!
                </Heading>
                <Text>
                    Conecte o seu calendário para verificar automaticamente as horas ocupadas e os novos eventos à medida em que são agendados.
                </Text>
                <MultiStep size={4} currentStep={2} />

            </Header>

            <ConnectBox>
                <ConnectItem>
                    <Text>
                        Google Calendar
                    </Text>
                    <Button variant={"secondary"} size="sm" onClick={() => signIn('google')}>
                        Conectar
                        <ArrowRight />
                    </Button>
                </ConnectItem>
                <Button type="submit">
                    Proxímo passo
                    <ArrowRight />
                </Button>

            </ConnectBox>



        </Container>
    )
}