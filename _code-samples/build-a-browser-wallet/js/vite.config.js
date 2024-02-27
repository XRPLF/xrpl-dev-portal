import { defineConfig, loadEnv } from 'vite';

import polyfillNode from 'rollup-plugin-polyfill-node';

const viteConfig = ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, '', '') };
    return defineConfig({
        define: {
            'process.env': process.env,
        },
        optimizeDeps: {
            esbuildOptions: {
                define: {
                    global: 'globalThis',
                },
            },
        },
        build: {
            rollupOptions: {
                plugins: [polyfillNode()],
            },
        },
        resolve: {
            alias: {
                ws: 'xrpl/dist/npm/client/WSWrapper',
            },
        },
    });
};

export default viteConfig;
