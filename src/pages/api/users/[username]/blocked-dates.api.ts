// import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)

  // Pega a data da url
  const { year, month } = req.query

  // se não for informado uma data ele restorna um erro
  if (!year || !month) {
    return res.status(400).json({ message: 'Year or month not specified' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist' })
  }

  // Essa array tem a informação dos dias que a pessoas tem disponibilidade tipo pode ser um array de [1, 2] segunda e terça
  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  // Aqui eu só retorno os que não estão na array de cima
  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.week_day == weekDay,
    )
  })

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
        SELECT
        EXTRACT(DAY FROM S.date) AS date,
        COUNT(S.date) AS amount,
        ((UTI.time_end_in_minutes - uti.time_start_in_minutes) / 60) AS size


        FROM schedulings S

        LEFT JOIN user_time_intervals UTI
            ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))

        WHERE S.user_id = ${user.id}
            AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}

        GROUP BY EXTRACT(DAY FROM S.date),
            ((UTI.time_end_in_minutes - uti.time_start_in_minutes) / 60)

        HAVING amount >= size
    `

  const blockedDates = blockedDatesRaw.map((item) => item.date)

  return res.json({ blockedWeekDays, blockedDates })
}
