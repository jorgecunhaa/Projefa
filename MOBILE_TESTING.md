# Guia de Teste no Telemóvel - Projefa

## 📱 Testar no Dispositivo Móvel

A aplicação **Projefa** foi desenvolvida para funcionar em dispositivos móveis (Android e iOS). Segue as instruções para testar no telemóvel.

## 🤖 Android

### Pré-requisitos
- Android Studio instalado
- Dispositivo Android ou Emulador
- USB Debugging ativado no dispositivo

### Passos

1. **Adicionar plataforma Android (primeira vez)**
```bash
cd Projefa
ionic capacitor add android
```

2. **Sincronizar código**
```bash
npx cap sync
```

3. **Abrir no Android Studio**
```bash
npx cap open android
```

4. **No Android Studio:**
   - Conecta o telemóvel via USB
   - Ativa "USB Debugging" no telemóvel
   - Clica em "Run" (▶️) ou pressiona Shift+F10
   - Seleciona o telemóvel na lista de dispositivos
   - A aplicação será instalada e executada no telemóvel

### Testar Funcionalidades no Telemóvel

#### ✅ Funcionalidades que REQUEREM dispositivo móvel:
- **SQLite**: Base de dados local (não funciona no browser)
- **Notificações Locais**: Requer permissões do dispositivo
- **Câmera**: Captura de imagens das tarefas
- **Controlo de Orientação**: Bloqueio de rotação do ecrã

#### ✅ Funcionalidades que funcionam em ambos:
- Gestão de Categorias, Projetos e Tarefas
- Calendário
- Pesquisa
- Estatísticas
- Modo escuro/claro
- Exportação de dados

## 🍎 iOS

### Pré-requisitos
- macOS com Xcode instalado
- Dispositivo iOS ou Simulador
- Conta de desenvolvedor Apple (para dispositivo físico)

### Passos

1. **Adicionar plataforma iOS (primeira vez)**
```bash
cd Projefa
ionic capacitor add ios
```

2. **Sincronizar código**
```bash
npx cap sync
```

3. **Abrir no Xcode**
```bash
npx cap open ios
```

4. **No Xcode:**
   - Seleciona o simulador ou dispositivo físico
   - Clica em "Run" (▶️) ou pressiona Cmd+R
   - A aplicação será instalada e executada

## 🔧 Testar em Desenvolvimento (Live Reload)

Para testar com atualizações em tempo real:

### Android
```bash
# Terminal 1: Servidor de desenvolvimento
ionic serve

# Terminal 2: Sincronizar e abrir
npx cap sync
npx cap open android

# No Android Studio, ao fazer Run, a app conecta ao servidor local
```

### iOS
```bash
# Terminal 1: Servidor de desenvolvimento
ionic serve

# Terminal 2: Sincronizar e abrir
npx cap sync
npx cap open ios

# No Xcode, ao fazer Run, a app conecta ao servidor local
```

**Nota:** Certifica-te de que o telemóvel e o computador estão na mesma rede Wi-Fi.

## 📋 Checklist de Teste no Telemóvel

### Funcionalidades Base
- [ ] Criar/Editar/Eliminar Categorias
- [ ] Criar/Editar/Eliminar Projetos
- [ ] Criar/Editar/Eliminar Tarefas
- [ ] Visualizar tarefas no calendário
- [ ] Receber notificações de tarefas

### Funcionalidades Extras
- [ ] Pesquisa global funciona
- [ ] Estatísticas são calculadas corretamente
- [ ] Modo escuro/claro alterna
- [ ] Exportação de dados funciona
- [ ] Citações são carregadas
- [ ] Controlo de orientação funciona

### Funcionalidades Nativas
- [ ] SQLite guarda dados localmente
- [ ] Notificações aparecem no dispositivo
- [ ] Câmera captura imagens
- [ ] Imagens são guardadas e exibidas
- [ ] Orientação bloqueia/desbloqueia corretamente

## ⚠️ Problemas Comuns

### "SQLite não funciona"
- **Causa**: SQLite só funciona em dispositivos nativos
- **Solução**: Testa no telemóvel, não no browser

### "Notificações não aparecem"
- **Causa**: Permissões não concedidas
- **Solução**: Vai às Configurações do dispositivo > Apps > Projefa > Permissões > Ativar Notificações

### "Câmera não abre"
- **Causa**: Permissões não concedidas
- **Solução**: Vai às Configurações do dispositivo > Apps > Projefa > Permissões > Ativar Câmera

### "App não sincroniza com servidor"
- **Causa**: Dispositivo e computador em redes diferentes
- **Solução**: Certifica-te de que ambos estão na mesma Wi-Fi

## 🎯 Resumo

**Para testar completamente a aplicação, DEVES testar no telemóvel**, pois:
- SQLite só funciona em dispositivos nativos
- Notificações requerem permissões do dispositivo
- Câmera requer permissões do dispositivo
- Controlo de orientação só funciona em dispositivos nativos

O browser serve apenas para desenvolvimento básico, mas **não substitui o teste no dispositivo móvel**.
