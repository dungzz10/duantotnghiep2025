import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; 
import App from "./App.jsx";
import { router } from "./router/router.jsx";
import "./index.css";

// Tạo instance của QueryClient
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Cung cấp QueryClient cho toàn bộ ứng dụng */}
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <App />
      {/* Thêm Devtools cho react-query */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
