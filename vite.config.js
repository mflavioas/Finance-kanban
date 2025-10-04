import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // 1. Importe o plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 2. Adicione e configure o plugin PWA
    VitePWA({
      registerType: 'autoUpdate', // Atualiza o PWA automaticamente
      
      // Configurações do manifesto da aplicação
      manifest: {
        name: 'SeiQueDevo! - Gerenciador Financeiro Kanban',
        short_name: 'SeiQueDevo',
        description: 'Um gerenciador financeiro pessoal no estilo Kanban.',
        theme_color: '#ffffff', // Cor da barra de ferramentas do app
        background_color: '#f4f5f7', // Cor da tela de splash
        display: 'standalone', // Faz o app abrir como uma janela independente
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon-192x182.png', // Caminho relativo à pasta public/
            sizes: '192x182',
            type: 'image/png'
          },
          {
            src: 'icon-512x485.png', // Caminho relativo à pasta public/
            sizes: '512x485',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})