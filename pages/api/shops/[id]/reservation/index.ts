import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withSession } from "@libs/withSession";
import { withHandler } from "@libs/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    query: { id },
    body: { time, date },
  } = req;

  const now = new Date().toISOString().split("T")[0];

  await client.reservation.deleteMany({
    where: {
      date: {
        lt: now,
      },
    },
  });

  const shopUser = await client.shop.findUnique({
    where: {
      id: +id,
    },
    select: {
      userId: true,
    },
  });

  if (shopUser?.userId !== user?.id) {
    const existedMyReservation = await client.reservation.findMany({
      where: {
        reservationUserId: +user?.id!,
        date,
        time,
      },
    });

    if (existedMyReservation.length === 0) {
      const newReservation = await client.reservation.create({
        data: {
          time,
          date,
          reservationShop: {
            connect: {
              id: +id.toString(),
            },
          },
          reservationUser: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
      res.json({ ok: true, newReservation });
    }
    res.json({ ok: false, error: "duplicate with another reservation time" });
  } else {
    res.json({ ok: false, error: "access denied" });
  }
}

export default withSession(withHandler({ method: ["POST"], fn: handler }));