package com.kohi.app;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import java.util.List;
import java.util.Map;

import com.sun.net.httpserver.HttpServer;

class App {
    // curl localhost:8080/api/hello  => "Hello"
    public static void main(String[] args) throws IOException {
        int serverPort = 8080;
        // Basic Java HTTP server.
        HttpServer server = HttpServer.create(new InetSocketAddress(serverPort), 0);

        server.createContext("/api/hello", (exchange -> {
            String respText = "Hello\n";
            exchange.sendResponseHeaders(200, respText.getBytes().length);

            OutputStream output = exchange.getResponseBody();
            output.write(respText.getBytes());
            output.flush();
            exchange.close();
        }));

        server.setExecutor(null);
        server.start();
    }

}
