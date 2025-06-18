# AI Paraphrase Tool

A modern web application that uses Google Gemini 2.0 Flash API to intelligently paraphrase text. Built with Next.js and designed for easy deployment on Vercel.

## Features

- **Smart Text Selection**: Select any portion of text to paraphrase it instantly
- **Full Document Paraphrasing**: Transform entire documents while maintaining context
- **Real-time Processing**: Powered by Google Gemini 2.0 Flash for fast, accurate results
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **One-click Copy**: Easy copying of both original and paraphrased content
- **Replace Functionality**: Replace original text with paraphrased version seamlessly

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key (already configured in the project)

### Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deployment on Vercel

1. Push your code to a GitHub repository
2. Connect your GitHub account to Vercel
3. Import the repository in Vercel
4. The environment variables are already configured in `vercel.json`
5. Deploy!

The app will automatically deploy and be available at your Vercel URL.

## How to Use

1. **Type or paste text** into the main text area
2. **Select any portion** of text you want to paraphrase - a floating button will appear
3. **Click the paraphrase button** to transform just the selected text
4. **Use "Paraphrase All"** to transform the entire text
5. **Copy results** using the copy buttons
6. **Replace original** text with the paraphrased version if desired

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.0 Flash API
- **Icons**: Lucide React
- **Deployment**: Vercel

## API Configuration

The application uses the Google Gemini API with the following configuration:

- Model: `gemini-2.0-flash-exp`
- API Key: Pre-configured (AIzaSyCIS916Y_HlNAveCAQGDN0l6A4wDPlRwaA)

## Environment Variables

The following environment variables are configured:

- `GEMINI_API_KEY`: Your Google Gemini API key (already set)

## License

This project is created for educational purposes.
