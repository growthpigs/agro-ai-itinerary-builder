import { chromium } from 'playwright';

async function findBischoffOrchards() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('Navigating to localhost:8080...');
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');
        
        console.log('Page loaded, looking for producers or Bischoff...');
        
        // Look for Bischoff Orchards directly first
        let bischoffElements = await page.locator('text=Bischoff').count();
        console.log(`Found ${bischoffElements} Bischoff elements on page`);
        
        if (bischoffElements > 0) {
            console.log('Clicking on Bischoff element...');
            await page.locator('text=Bischoff').first().click();
            await page.waitForLoadState('networkidle');
        } else {
            // Look for producers navigation
            const producersLink = page.locator('a:has-text("Producers")');
            const producersCount = await producersLink.count();
            console.log(`Found ${producersCount} Producers links`);
            
            if (producersCount > 0) {
                console.log('Clicking Producers link...');
                await producersLink.click();
                await page.waitForLoadState('networkidle');
                
                // Now look for Bischoff on the producers page
                bischoffElements = await page.locator('text=Bischoff').count();
                console.log(`Found ${bischoffElements} Bischoff elements on producers page`);
                
                if (bischoffElements > 0) {
                    console.log('Clicking on Bischoff element...');
                    await page.locator('text=Bischoff').first().click();
                    await page.waitForLoadState('networkidle');
                }
            } else {
                // Try searching
                const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
                const searchCount = await searchInput.count();
                console.log(`Found ${searchCount} search inputs`);
                
                if (searchCount > 0) {
                    console.log('Using search...');
                    await searchInput.fill('Bischoff');
                    await page.keyboard.press('Enter');
                    await page.waitForLoadState('networkidle');
                }
            }
        }
        
        console.log('Taking screenshot...');
        await page.screenshot({ path: 'bischoff_orchards_screenshot.png', fullPage: true });
        
        // Check if we found the updated description
        const pageContent = await page.content();
        if (pageContent.includes('Bischoff Orchards is the newest and most exciting addition to the Bainsville, Ontario farming scene!')) {
            console.log('✅ Found the updated description!');
        } else {
            console.log('❌ Updated description not found');
            console.log('Current URL:', page.url());
            console.log('Page title:', await page.title());
        }
        
    } catch (error) {
        console.error('Error:', error);
        await page.screenshot({ path: 'error_screenshot.png' });
    } finally {
        await browser.close();
    }
}

findBischoffOrchards().catch(console.error);