import { Heading, Text, MultiStep, TextInput, Button } from "@ignite-ui/react";
import { Container, Header } from "../style";
import { ArrowRight, Check } from "phosphor-react";
import { AuthError, ConnectBox, ConnectItem } from "./style";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";


export default function Register() {
    const session = useSession()
    const router = useRouter()

    const hasAuthError = !!router.query.error
    const isSignedIn = session.status == 'authenticated'

    async function handleConnectCalendar() {
        await signIn('google')
    }

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
                    {
                        isSignedIn ? (
                            <Button size='sm' disabled>
                                Conectado
                                <Check />
                            </Button>
                        ) : (
                            <Button variant={"secondary"} size="sm" onClick={handleConnectCalendar}>
                                Conectar
                                <ArrowRight />
                            </Button>
                        )
                    }
                </ConnectItem>
                {
                    hasAuthError && (
                        <AuthError size='sm'>
                            Falha ao se conectar com o google, verifique se você habilitou as permissões
                            de acesso ao Google Calendar.
                        </AuthError>
                    )
                }
                <Button type="submit" disabled={!isSignedIn}>
                    Proxímo passo
                    <ArrowRight />
                </Button>

            </ConnectBox>



        </Container>
    )
}