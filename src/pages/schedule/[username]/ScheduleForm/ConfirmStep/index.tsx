import { ConfirmForm, FormAction, FormError, FormHeader } from "./style";
import { useForm } from "react-hook-form";
import { CalendarBlank, Clock } from "phosphor-react";
import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { api } from "../../../../../lib/axios";
import { useRouter } from "next/router";

const confirmFormSchema = z.object({
    name: z.string().min(3, { message: 'O nome precisa no mínimo 3 caracteres' }),
    email: z.string().email({ message: 'Digite um e-mail válido' }),
    observation: z.string().nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

interface ConfirmStepProps {
    schedulingDate: Date
    onCancelConfirmation: () => void
}
export function ConfirmStep({ schedulingDate, onCancelConfirmation }: ConfirmStepProps) {
    const {
        register,
        handleSubmit, formState: { isSubmitting, errors }
    } = useForm<ConfirmFormData>({
        resolver: zodResolver(confirmFormSchema)
    })

    const router = useRouter()
    const username = router.query.username

    async function handleConfirmScheduling(data: ConfirmFormData) {
        const { name, email, observation } = data

        await api.post(`users/${username}/schedule`, {
            name, 
            email, 
            observation,
            date: schedulingDate
        })

        onCancelConfirmation()
    }


    const describeDate = dayjs(schedulingDate).format('DD[ de ]MMMMM[ de ]YYYY')
    const describeTime = dayjs(schedulingDate).format('HH:mm[h]')

    return (
        <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
            <FormHeader>
                <Text>
                    <CalendarBlank />
                    {describeDate}
                </Text>
                <Text>
                    <Clock />
                    {describeTime}
                </Text>
            </FormHeader>

            <label>
                <Text size="sm">Nome Completo</Text>
                <TextInput placeholder="Seu nome"  {...register('name')} />
                {errors.name && (
                    <FormError>
                        {errors.name.message}
                    </FormError>
                )}
            </label>

            <label>
                <Text size="sm">Endereço de e-mail</Text>
                <TextInput type="email" placeholder="johndoe@example.com" {...register('email')} />
                {errors.email && (
                    <FormError>
                        {errors.email.message}
                    </FormError>
                )}
            </label>

            <label>
                <Text size="sm">Observações</Text>
                <TextArea  {...register('observation')} />
            </label>

            <FormAction>
                <Button
                    type="button"
                    variant="tertiary"
                    disabled={isSubmitting}
                    onClick={onCancelConfirmation}
                >
                    Cancelar
                </Button>
                <Button type="submit">Confirmar</Button>
            </FormAction>
        </ConfirmForm>
    )
}