import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client";
import { withSession } from "@libs/withSession";
import { withHandler } from "@libs/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const userWithDetails = await client.user.findUnique({
      where: {
        id: user?.id,
      },
      include: {
        reviews: {
          select: {
            id: true,
            createdAt: true,
            review: true,
            createdUser: {
              select: {
                id: true,
                username: true,
              },
            },
            commentedShop: {
              select: {
                id: true,
                name: true,
              },
            },
            score: true,
          },
        },
        shops: true,
        hearts: {
          select: {
            likedShopId: true,
          },
        },
        reservations: {
          select: {
            id: true,
            reservationShop: {
              select: {
                id: true,
                name: true,
              },
            },
            date: true,
            time: true,
          },
        },
      },
    });

    if (userWithDetails) {
      res.json({ ok: true, userWithDetails });
    } else {
      res.json({ ok: false });
    }
  }

  if (req.method === "PUT") {
    const {
      body,
      session: { user },
    } = req;
    try {
      const updatedUser = await client.user.update({
        where: {
          id: user?.id,
        },
        data: body,
      });

      req.session.user = {
        id: user?.id!,
        username: updatedUser.username,
        avatarId: updatedUser.avatarId ? updatedUser.avatarId : undefined,
        logintype: user?.logintype!,
      };
      await req.session.save();

      res.json({ ok: true, updatedUser });
    } catch (error) {
      res.json({ ok: false, error });
    }
  }
}

export default withSession(
  withHandler({ method: ["GET", "PUT"], fn: handler })
);
