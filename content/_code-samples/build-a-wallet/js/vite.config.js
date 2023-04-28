import { defineConfig, loadEnv } from 'vite';

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
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
                plugins: [
                    NodeGlobalsPolyfillPlugin({
                        process: true,
                        buffer: true,
                    }),
                ],
            },
        },
        build: {
            rollupOptions: {
                plugins: [polyfillNode()],
            },
        },
        resolve: {
            alias: {
                events: 'events',
                crypto: 'crypto-browserify',
                stream: 'stream-browserify',
                http: 'stream-http',
                https: 'https-browserify',
                ws: 'xrpl/dist/npm/client/WSWrapper',
            },
        },
    });
};

export default viteConfig;
