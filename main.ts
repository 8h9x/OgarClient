import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";

const router = new Hono();
router.get("/*", serveStatic({ root: "./www" }));
router.get("/skins/*", serveStatic({ root: "./" }));
router.get("/api/skins", async ctx => {
    const skins = [];

    try {
        await Deno.lstat("./skins");
        for await (const file of Deno.readDir("./skins")) {
            if (file.isDirectory) continue;
            skins.push(file.name.split(".")[0]);
        };
    } catch (err) {
        console.error(err);
    } finally {
        return ctx.json(skins);
    };
});

if (import.meta.main) {
    Deno.serve(router.fetch);
};
