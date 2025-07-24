import {
        ChakraProvider,
        createSystem,
        defaultConfig,
        defineConfig,
    } from "@chakra-ui/react";
    import Navigation from "../components/Navigation";

    const config = defineConfig({
        theme: {
            tokens: {
                colors: {},
            },
        },
    });
    const system = createSystem(defaultConfig, config);

    function MyApp({ Component, pageProps }) {
        return (
            <ChakraProvider value={system}>
                <Navigation />
                <Component {...pageProps} />
            </ChakraProvider>
        );
    }

    export default MyApp;