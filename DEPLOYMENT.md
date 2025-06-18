# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy from Git Repository

1. **Push to GitHub**: Push your code to a GitHub repository
2. **Connect Vercel**: Go to [vercel.com](https://vercel.com) and sign in
3. **Import Project**: Click "New Project" and import your GitHub repository
4. **Configure**:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
5. **Environment Variables**: The API key is already configured in `vercel.json`
6. **Deploy**: Click "Deploy" and wait for completion

### Option 2: Deploy using Vercel CLI

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Environment Variables

The Gemini API key is already configured in the project. If you need to change it:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add/modify: `GEMINI_API_KEY` = `your_api_key_here`

### Domain Configuration

After deployment, you can:

1. Use the provided `.vercel.app` domain
2. Add a custom domain in the Vercel dashboard
3. Configure DNS settings if using custom domain

### Build Configuration

The project is configured with:

- Node.js 18.x runtime
- Automatic deployments on git push
- Preview deployments for pull requests
- Edge runtime for API routes (optional)

### Monitoring

Monitor your deployment:

- Functions tab: Check API route performance
- Analytics tab: View usage statistics
- Real-time logs for debugging

## Testing the Deployed App

1. Visit your Vercel URL
2. Type some text in the main textarea
3. Select a portion of text - a "Paraphrase" button should appear
4. Click it to paraphrase just the selected text
5. Or use "Paraphrase All" to transform the entire text
6. Test copy functionality and text replacement

## Troubleshooting

### Common Issues:

1. **API Key Issues**: Ensure the GEMINI_API_KEY is properly set
2. **Build Errors**: Check the Functions tab in Vercel dashboard
3. **CORS Issues**: API routes are configured for same-origin requests
4. **Rate Limits**: Gemini API has rate limits - implement throttling if needed

### Debug Steps:

1. Check Vercel Functions logs
2. Verify environment variables
3. Test API endpoints directly: `https://yourapp.vercel.app/api/paraphrase`
4. Check browser console for errors
