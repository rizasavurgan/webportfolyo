# Brutalist Portfolio Website

A modern, brutalist and typography-focused portfolio website built with Next.js, TailwindCSS, and Sanity CMS.

## Features

- **Brutalist Design**: Bold typography and minimal aesthetics
- **Responsive Layout**: Mobile-first design that works on all devices
- **macOS Folder Cards**: Project cards styled like macOS folders with hover animations
- **CMS Integration**: All content managed through Sanity CMS
- **Smooth Animations**: Framer Motion powered animations
- **SEO Optimized**: Next.js metadata and Open Graph tags
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS
- **CMS**: Sanity.io
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── work/
│   │   │   └── [slug]/
│   │   ├── me/
│   │   ├── contact/
│   │   └── studio/
│   ├── components/
│   └── lib/
├── sanity/
│   └── schemas/
└── public/
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Sanity account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd webportfolyo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
```

4. Set up Sanity:
```bash
npm run studio
```
This will open Sanity Studio at `http://localhost:3333` where you can:
- Create your Sanity project
- Configure your schemas
- Add your content

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Sanity CMS Setup

### Schemas

The project includes the following Sanity schemas:

1. **Projects**: Portfolio projects with images, descriptions, and metadata
2. **About**: Personal information and bio
3. **Contact**: Contact information and social links
4. **Site Settings**: Global site configuration

### Content Management

Access the Sanity Studio at `/studio` to manage all content. The studio provides a user-friendly interface for:

- Adding and editing projects
- Managing personal information
- Updating contact details
- Configuring site settings

## Pages

- **Home** (`/`): Hero section with featured projects
- **Work** (`/work`): Grid of all projects
- **Project Detail** (`/work/[slug]`): Individual project pages
- **About** (`/me`): Personal information and bio
- **Contact** (`/contact`): Contact form and information

## Customization

### Colors

The project uses a brutalist color palette defined in `tailwind.config.js`:

```javascript
colors: {
  accent: {
    yellow: '#FFD700',
    green: '#00FF00',
    orange: '#FF6B35',
    gray: '#808080',
  },
}
```

### Typography

The design uses Inter font family with custom brutalist styles defined in `globals.css`.

### Animations

Animations are powered by Framer Motion and can be customized in individual components.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The project can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please open an issue in the repository or contact [hello@rizasavurgan.com](mailto:hello@rizasavurgan.com).