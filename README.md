# Front end for Advanced WEB Project course.

## Link to the deployed app

[https://lively-moss-05fbe2703.3.azurestaticapps.net/](https://lively-moss-05fbe2703.3.azurestaticapps.net/)

## Team

- Alicja Williams
- Gleb Bulygin
- Igor Bologov

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/DIN24-AGI/cinema-front-end.git
cd cinema-front
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deploying to Production

The app automatically deploys to Azure Static Web Apps when you push a version tag.

### How to Deploy

1. Make sure all your changes are committed and pushed to the main branch:

```bash
git add -A
git commit -m "Your commit message"
git push origin main
```

2. Create and push a version tag:

```bash
# Create an annotated tag (use semantic versioning: v1.0.0, v1.0.1, v1.1.0, etc.)
git tag -a v1.0.1 -m "Release v1.0.1"

# Push the tag to trigger deployment
git push origin v1.0.1
```

Once you push the tag the github deployment action will be triggered.

3. Check the deployment status:
   - Go to the [Actions tab](https://github.com/DIN24-AGI/cinema-front-end/actions) in GitHub
   - Wait for the workflow to complete (usually 1-2 minutes)
   - Visit the deployed app at the link above

### Version Numbering

Use semantic versioning:

- `v1.0.0` - Major release
- `v1.0.1` - Bug fix
- `v1.1.0` - New feature

**Note:** Each tag should be unique. Increment the version number for each deployment.
