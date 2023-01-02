import { zodResolver } from "@hookform/resolvers/zod";
import { Heading, Text, MultiStep, Checkbox, TextInput, Button } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../lib/axios";
import { convertTimeStringToMinutes } from "../../../utils/conver-time-string-to-minutes";
import { getWeekDays } from "../../../utils/get-week-days";
import { Container, Header } from "../style";
import { IntervalBox, IntervalContainer, IntervalDay, IntervalInputs, IntervalItem, FormError } from "./style";

const TimeIntervalsFormSchema = z.object({
    intervals: z.array(z.object({
        weekday: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
    })
    ).length(7)
        .transform((intervals) => intervals.filter((intervals) => intervals.enabled))
        .refine((intervals) => intervals.length > 0, {
            message: 'Você precisa selecionar pelo menos um dia da semana!'
        })
        .transform((intervals) => {
            return intervals.map((interval) => {
                return {
                    weekDay: interval.weekday,
                    startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
                    endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
                }
            })
        })
        .refine((intervals) => {
            return intervals.every(
                (interval) =>
                    interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
            )
        }, {
            message: 'O horário de término deve ser pelo menos 1h distante do início'
        })
})


type TimeIntervalsFormDataInput = z.input<typeof TimeIntervalsFormSchema>
type TimeIntervalsFormDataOutput = z.output<typeof TimeIntervalsFormSchema>


export default function TimeIntervals() {
    const {
        register,
        control,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TimeIntervalsFormDataInput>({
        defaultValues: {
            intervals: [
                { weekday: 0, enabled: false, startTime: "08:00", endTime: "18:00" },
                { weekday: 1, enabled: true, startTime: "08:00", endTime: "18:00" },
                { weekday: 2, enabled: true, startTime: "08:00", endTime: "18:00" },
                { weekday: 3, enabled: true, startTime: "08:00", endTime: "18:00" },
                { weekday: 4, enabled: true, startTime: "08:00", endTime: "18:00" },
                { weekday: 5, enabled: true, startTime: "08:00", endTime: "18:00" },
                { weekday: 6, enabled: false, startTime: "08:00", endTime: "18:00" },
            ]
        },
        resolver: zodResolver(TimeIntervalsFormSchema)
    })

    const weeksDays = getWeekDays()

    const intervals = watch('intervals')

    const { fields } = useFieldArray({
        control,
        name: 'intervals'
    })


    async function handleSetTimeIntervals(data: any) {
        const { intervals } = data as TimeIntervalsFormDataOutput

        await api.post('/users/time-intervals', {
            intervals
        })
    }

    return (
        <Container>
            <Header>
                <Heading as="strong">
                    Quase lá
                </Heading>
                <Text>
                    Defina o intervalo de horários que você está disponível em cada dia da semana.
                </Text>
                <MultiStep size={4} currentStep={3} />
            </Header>
            <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
                <IntervalContainer>
                    {
                        fields.map((field, index) => {
                            return (
                                <IntervalItem key={field.id}>
                                    <IntervalDay>
                                        <Controller
                                            name={`intervals.${index}.enabled`}
                                            control={control}
                                            render={({ field }) => {
                                                return (
                                                    <Checkbox
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(checked === true)
                                                        }}
                                                        checked={field.value}
                                                    />

                                                )
                                            }} />
                                        <Text>{weeksDays[field.weekday]}</Text>
                                    </IntervalDay>
                                    <IntervalInputs>
                                        <TextInput
                                            size='sm'
                                            type='time'
                                            step={60}
                                            disabled={intervals[index].enabled === false}
                                            {...register(`intervals.${index}.startTime`)}
                                        />
                                        <TextInput
                                            size='sm'
                                            type='time'
                                            step={60}
                                            disabled={intervals[index].enabled === false}
                                            {...register(`intervals.${index}.endTime`)}
                                        />
                                    </IntervalInputs>
                                </IntervalItem>
                            )
                        })
                    }
                </IntervalContainer>

                {
                    errors.intervals && (
                        <FormError size='sm'>
                            {errors.intervals.message}
                        </FormError>
                    )
                }
                <Button type="submit" disabled={isSubmitting}>
                    Próximo passo
                    <ArrowRight />
                </Button>
            </IntervalBox>
        </Container>
    )
}