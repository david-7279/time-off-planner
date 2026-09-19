import { and, eq } from "drizzle-orm";
import { logger } from "../logger/logger.js";
import { hashPassword } from "../security/password.js";
import { db } from "./db.js";
import { pool } from "./pool.js";
import * as schema from "./schema/index.js";

async function main() {
  logger.info("Seeding database...");

  await db.transaction(async (tx) => {
    // ── Leave types: fixed vocabulary the app depends on ──
    const [vacation, sick, personal] = await tx
      .insert(schema.leaveTypes)
      .values([
        { name: "vacation", defaultAllowance: 25 },
        { name: "sick", defaultAllowance: 5 },
        { name: "personal", defaultAllowance: 3 },
      ])
      .returning();

    // ── Teams ──
    const [engineering, design] = await tx
      .insert(schema.teams)
      .values([{ name: "Engineering" }, { name: "Design" }])
      .returning();

    // ── Users: 1 manager + 2 members per team, known credentials for dev logins ──
    const [tom, sara, alex, maya, leo] = await tx
      .insert(schema.users)
      .values([
        {
          name: "Tom",
          email: "tom@dev.local",
          passwordHash: await hashPassword("password123"),
          role: "manager",
          teamId: engineering.id,
        },
        {
          name: "Sara",
          email: "sara@dev.local",
          passwordHash: await hashPassword("password123"),
          role: "member",
          teamId: engineering.id,
        },
        {
          name: "Alex",
          email: "alex@dev.local",
          passwordHash: await hashPassword("password123"),
          role: "member",
          teamId: engineering.id,
        },
        {
          name: "Maya",
          email: "maya@dev.local",
          passwordHash: await hashPassword("password123"),
          role: "manager",
          teamId: design.id,
        },
        {
          name: "Leo",
          email: "leo@dev.local",
          passwordHash: await hashPassword("password123"),
          role: "member",
          teamId: design.id,
        },
      ])
      .returning();

    // ── Balances: every user × every leave type, current year ──
    const year = new Date().getFullYear();
    await tx.insert(schema.leaveBalances).values(
      [tom, sara, alex, maya, leo].flatMap((user) =>
        [vacation, sick, personal].map((type) => ({
          userId: user.id,
          leaveTypeId: type.id,
          year,
          allowanceDays: type.defaultAllowance,
          usedDays: 0,
        }))
      )
    );

    await tx.insert(schema.leaveRequests).values({
      userId: alex.id,
      leaveTypeId: vacation.id,
      startsAt: "2026-01-12",
      endsAt: "2026-01-16",
      workingDays: 5,
      status: "approved",
      reviewerId: tom.id,
    });

    await tx
      .update(schema.leaveBalances)
      .set({ usedDays: 5 })
      .where(
        and(
          eq(schema.leaveBalances.userId, alex.id),
          eq(schema.leaveBalances.leaveTypeId, vacation.id),
          eq(schema.leaveBalances.year, year)
        )
      );
  });

  logger.info("Seeding complete");
}

main()
  .catch((error) => {
    logger.error({ error }, "Seeding failed:");
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
