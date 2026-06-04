#!/bin/bash

# 赛博梗王 Phase 1 - 项目初始化脚本
# 使用方式：chmod +x init-phase1.sh && ./init-phase1.sh

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 赛博梗王 Phase 1 - 项目初始化${NC}"
echo ""

# Step 1: 创建前端项目
echo -e "${YELLOW}[1/6] 创建前端项目...${NC}"
npm create vite@latest cyber-meme-frontend -- --template vue
cd cyber-meme-frontend
npm install vue@3.3.0 pinia@2.1.0 axios@1.4.0
cd ..

# Step 2: 创建后端项目
echo -e "${YELLOW}[2/6] 创建后端项目...${NC}"
mkdir -p cyber-meme-backend
cd cyber-meme-backend
npm init -y
npm install express@4.18.0 cors@2.8.5 dotenv@16.3.0 openai@4.0.0 express-rate-limit@7.0.0
npm install -D nodemon@3.0.0
cd ..

# Step 3: 创建前端目录结构
echo -e "${YELLOW}[3/6] 创建前端目录结构...${NC}"
mkdir -p cyber-meme-frontend/src/{components,services,stores,data}
touch cyber-meme-frontend/src/components/{TextGenerator.vue,TemplateLibrary.vue,DraftBox.vue,Layout.vue}
touch cyber-meme-frontend/src/services/{api.js,draftService.js,analytics.js}
touch cyber-meme-frontend/src/stores/index.js
touch cyber-meme-frontend/src/data/templates.json

# Step 4: 创建后端目录结构
echo -e "${YELLOW}[4/6] 创建后端目录结构...${NC}"
mkdir -p cyber-meme-backend/src/{routes,services,middleware,config}
touch cyber-meme-backend/src/routes/{generate.js,health.js}
touch cyber-meme-backend/src/services/openai.js
touch cyber-meme-backend/src/middleware/{auth.js,rateLimit.js}
touch cyber-meme-backend/src/config/constants.js
touch cyber-meme-backend/src/index.js

# Step 5: 创建配置文件
echo -e "${YELLOW}[5/6] 创建配置文件...${NC}"
cat > cyber-meme-backend/.env.example << 'EOF'
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4
NODE_ENV=development
PORT=3001
MOCK_MODE=true
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=10
EOF

cat > cyber-meme-backend/.env << 'EOF'
OPENAI_API_KEY=sk-demo
OPENAI_MODEL=gpt-4
NODE_ENV=development
PORT=3001
MOCK_MODE=true
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=10
EOF

cat > cyber-meme-frontend/.env.example << 'EOF'
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_TITLE=赛博梗王
EOF

# Step 6: 更新package.json scripts
echo -e "${YELLOW}[6/6] 配置脚本命令...${NC}"

# 后端package.json
cd cyber-meme-backend
npm pkg set scripts.dev="nodemon src/index.js"
npm pkg set scripts.start="node src/index.js"
cd ..

# 前端已默认包含dev/build等脚本

echo ""
echo -e "${GREEN}✅ 初始化完成！${NC}"
echo ""
echo -e "${BLUE}📝 后续步骤：${NC}"
echo ""
echo "1️⃣  启动后端服务（终端1）："
echo -e "${YELLOW}cd cyber-meme-backend && npm run dev${NC}"
echo ""
echo "2️⃣  启动前端开发（终端2）："
echo -e "${YELLOW}cd cyber-meme-frontend && npm run dev${NC}"
echo ""
echo "3️⃣  打开浏览器："
echo -e "${YELLOW}http://localhost:5173${NC}"
echo ""
echo -e "${BLUE}📚 参考文档：${NC}"
echo "- 技术方案：projects/cyber-meme-studio/PHASE1-TECH.md"
echo "- 执行清单：projects/cyber-meme-studio/PHASE1-CHECKLIST.md"
echo "- 启动工具：projects/cyber-meme-studio/PHASE1-STARTUP.md"
echo ""
