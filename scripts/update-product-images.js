#!/usr/bin/env node

/**
 * Скрипт для обновления ссылок на изображения продуктов в коде
 * Заменяет внешние URL на локальные пути к изображениям
 */

const fs = require('fs');
const path = require('path');

// Конфигурация
const PRODUCTS_DIR = 'public/images/products';
const MSW_HANDLERS_FILE = 'src/shared/api/msw/handlers.shop.ts';
const MOCK_SHOP_FILE = 'src/shared/hooks/useMockShop.ts';

// Маппинг продуктов на изображения
const PRODUCT_IMAGES = {
  // Пептиды
  'peptide-chicken': 'peptides/peptides-peptide-chicken-400x400.jpg',
  'peptide-fish': 'peptides/peptides-peptide-fish-400x400.jpg',
  'peptide-beef': 'peptides/peptides-peptide-beef-400x400.jpg',
  'peptide-skate': 'peptides/peptides-peptide-skate-400x400.jpg',
  
  // Добавки
  'antiparasitic': 'supplements/supplements-antiparasitic-400x400.jpg',
  'calcemarin': 'supplements/supplements-calcemarin-400x400.jpg',
  'nucleamin': 'supplements/supplements-nucleamin-400x400.jpg',
  'resveratrol': 'supplements/supplements-resveratrol-400x400.jpg',
  'argenix': 'supplements/supplements-argenix-400x400.jpg'
};

// Проверяем существование изображений
function checkImagesExist() {
  console.log('🔍 Проверяем существование изображений...');
  
  const missingImages = [];
  
  for (const [slug, imagePath] of Object.entries(PRODUCT_IMAGES)) {
    const fullPath = path.join(PRODUCTS_DIR, imagePath);
    if (!fs.existsSync(fullPath)) {
      missingImages.push({ slug, imagePath });
    }
  }
  
  if (missingImages.length > 0) {
    console.log('❌ Отсутствуют изображения:');
    missingImages.forEach(({ slug, imagePath }) => {
      console.log(`   - ${slug}: ${imagePath}`);
    });
    return false;
  }
  
  console.log('✅ Все изображения найдены!');
  return true;
}

// Обновляем файл MSW handlers
function updateMSWHandlers() {
  console.log('📝 Обновляем MSW handlers...');
  
  let content = fs.readFileSync(MSW_HANDLERS_FILE, 'utf8');
  
  // Заменяем внешние URL на локальные пути
  for (const [slug, imagePath] of Object.entries(PRODUCT_IMAGES)) {
    const oldPattern = new RegExp(`image_url:\\s*['"][^'"]*${slug}[^'"]*['"]`, 'g');
    const newImageUrl = `image_url: '/images/products/${imagePath}'`;
    
    if (content.includes(`slug: '${slug}'`)) {
      // Находим блок с продуктом и заменяем image_url
      const productPattern = new RegExp(
        `(\\{[^}]*slug:\\s*['"]${slug}['"][^}]*image_url:\\s*)['"][^'"]*['"]([^}]*\\})`,
        'g'
      );
      content = content.replace(productPattern, `$1'${newImageUrl}'$2`);
    }
  }
  
  fs.writeFileSync(MSW_HANDLERS_FILE, content);
  console.log('✅ MSW handlers обновлены');
}

// Обновляем файл useMockShop
function updateMockShop() {
  console.log('📝 Обновляем useMockShop...');
  
  let content = fs.readFileSync(MOCK_SHOP_FILE, 'utf8');
  
  // Заменяем внешние URL на локальные пути
  for (const [slug, imagePath] of Object.entries(PRODUCT_IMAGES)) {
    const oldPattern = new RegExp(`image_url:\\s*['"][^'"]*${slug}[^'"]*['"]`, 'g');
    const newImageUrl = `image_url: '/images/products/${imagePath}'`;
    
    if (content.includes(`slug: '${slug}'`)) {
      // Находим блок с продуктом и заменяем image_url
      const productPattern = new RegExp(
        `(\\{[^}]*slug:\\s*['"]${slug}['"][^}]*image_url:\\s*)['"][^'"]*['"]([^}]*\\})`,
        'g'
      );
      content = content.replace(productPattern, `$1'${newImageUrl}'$2`);
    }
  }
  
  fs.writeFileSync(MOCK_SHOP_FILE, content);
  console.log('✅ useMockShop обновлен');
}

// Основная функция
function main() {
  console.log('🚀 Запуск обновления изображений продуктов...\n');
  
  // Проверяем существование изображений
  if (!checkImagesExist()) {
    console.log('\n❌ Пожалуйста, добавьте все необходимые изображения перед запуском скрипта.');
    console.log('📁 Структура папок:');
    console.log(`   ${PRODUCTS_DIR}/`);
    console.log('   ├── peptides/');
    console.log('   └── supplements/');
    return;
  }
  
  // Обновляем файлы
  updateMSWHandlers();
  updateMockShop();
  
  console.log('\n🎉 Обновление завершено!');
  console.log('📋 Что было сделано:');
  console.log('   - Заменены внешние URL на локальные пути');
  console.log('   - Обновлены MSW handlers');
  console.log('   - Обновлен useMockShop hook');
  console.log('\n💡 Теперь изображения будут загружаться локально из папки public/images/products/');
}

// Запускаем скрипт
if (require.main === module) {
  main();
}

module.exports = { checkImagesExist, updateMSWHandlers, updateMockShop };
