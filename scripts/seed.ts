import prisma from "../lib/prisma";

async function main() {
    const workspace = await prisma.workspace.upsert({
        where: {
            apiKey: "atlas_due_demo_key",
        },
        update: {},
        create: {
            name: "Atlas Due Demo Workspace",
            apiKey: "atlas_due_demo_key",
        },
    });

    console.log("Seeded workspace:");
    console.log(workspace);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });