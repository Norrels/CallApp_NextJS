import { ConfirmForm, FormAction, FormError, FormHeader } from "./style";
import { useForm } from "react-hook-form";
import { CalendarBlank, Clock } from "phosphor-react";
import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const confirmFormSchema = z.object({
    name: z.string().min(3, {message: 'O nome precisa no mínimo 3 caracteres'}),
    email: z.string().email({message: 'Digite um e-mail válido'}),
    observations: z.string().nullable(),
})

type ConfirmFormData = z.infer<typeof confirmFormSchema>

export function ConfirmStep() {
    const {
        register,
        handleSubmit, formState: { isSubmitting, errors }
    } = useForm<ConfirmFormData>({
        resolver: zodResolver(confirmFormSchema)
    })

    function handleConfirmScheduling(data: ConfirmFormData) {
        console.log(data)
    }

    return (
        <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
            <FormHeader>
                <Text>
                    <CalendarBlank />
                    22 de Setembro de 2022
                </Text>
                <Text>
                    <Clock />
                    18:00h
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
                <TextInput type="email" placeholder="johndoe@example.com" {...register('email')}/>
                {errors.email && (
                    <FormError>
                        {errors.email.message}
                    </FormError>
                )}
            </label>

            <label>
                <Text size="sm">Observações</Text>
                <TextArea  {...register('observations')} />
            </label>

            <FormAction>
                <Button type="button" variant="tertiary" disabled={isSubmitting}>Cancelar</Button>
                <Button type="submit">Confirmar</Button>
            </FormAction>
        </ConfirmForm>
    )
}