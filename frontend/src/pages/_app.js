import {
    ChakraProvider,
    createSystem,
    defaultConfig,
    defineConfig,
} from "@chakra-ui/react"

const config = defineConfig({
    theme: {
        tokens: {
            colors: {},
        },
    },
})
const system = createSystem(defaultConfig, config)

function MyApp({Component, pageProps}) {
    return (
        <ChakraProvider value={system}>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}

export default MyApp;