# CLAUDE.md - AI Coding Rules for AGRO AI Itinerary Builder

This file defines the rules and conventions that Claude Code must follow when working on the AGRO AI Itinerary Builder PWA.

## 🤖 Project Awareness

- Always check for TODO files and planning documents before starting work
- Read INITIAL.md for feature requirements
- Check examples/ folder for code patterns to follow
- Review any existing PRPs in the PRPs/ folder
- Use TodoWrite tool to track all tasks and progress

## 📁 Code Structure Rules

### File Organization
- Keep component files under 300 lines
- Split large modules into smaller, focused files
- Use barrel exports (index.ts) for cleaner imports
- Follow the established directory structure in src/

### Module Patterns
```typescript
// ✅ Good: Named exports with explicit types
export const calculateRoute = (stops: Producer[]): Route => { }

// ❌ Bad: Default exports without types
export default function(stops) { }
```

## 🧪 Testing Requirements

### Unit Tests
- Write tests for all utility functions
- Use React Testing Library for components
- Aim for 80% code coverage minimum
- Test file naming: `*.test.ts` or `*.test.tsx`
- Place tests next to source files

### Test Patterns
```typescript
// Follow this pattern for component tests
describe('ProducerCard', () => {
  it('should render producer information', () => {
    // Arrange
    const producer = mockProducer();
    
    // Act
    render(<ProducerCard producer={producer} />);
    
    // Assert
    expect(screen.getByText(producer.name)).toBeInTheDocument();
  });
});
```

## 🎨 Style Conventions

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Prefer `interface` over `type` for object shapes
- Use enums for fixed sets of values
- Always specify return types for functions

### React Components
- Use functional components with hooks
- Prefer named exports
- Use proper TypeScript prop types
- Keep components focused and single-purpose

### Tailwind CSS
- Use Tailwind classes for styling
- Avoid inline styles
- Create component variants with cn() utility
- Follow mobile-first responsive design

### File Naming
- Components: PascalCase (e.g., `ProducerCard.tsx`)
- Utilities: camelCase (e.g., `calculateDistance.ts`)
- Types: PascalCase with `.types.ts` suffix
- Constants: UPPER_SNAKE_CASE in `.constants.ts` files

## 📝 Documentation Standards

### Code Comments
- Add JSDoc comments for all exported functions
- Explain complex algorithms inline
- Document API response shapes
- Include usage examples in JSDoc

### Component Documentation
```typescript
/**
 * Displays a producer card with basic information
 * @param producer - The producer data to display
 * @param onSelect - Callback when producer is selected
 * @example
 * <ProducerCard producer={data} onSelect={handleSelect} />
 */
export const ProducerCard: React.FC<ProducerCardProps> = ({ producer, onSelect }) => {
```

## ✅ Task Management

### When Starting Work
1. Use TodoWrite to create a task list
2. Mark tasks as in_progress when starting
3. Complete tasks immediately when done
4. Update task status in real-time

### Validation Gates
- Run `npm run build` before marking any task complete
- Run `npm run test` for any logic changes
- Run `npm run lint` to ensure code quality
- Fix all TypeScript errors before proceeding

## 🚀 Implementation Guidelines

### PWA Specific Rules
- Always consider offline functionality
- Implement proper caching strategies
- Ensure all assets are optimized for mobile
- Test on various screen sizes
- Follow PWA best practices for manifest.json

### Performance Standards
- Lazy load components where appropriate
- Optimize images (WebP format preferred)
- Bundle size: Keep under 200KB for initial load
- Use React.memo for expensive components
- Implement virtual scrolling for long lists

### Security Requirements
- Never expose API keys in client code
- Validate all user inputs
- Sanitize data before display
- Use HTTPS for all external requests
- Implement proper CORS handling

### AI Integration Guidelines
- Cache AI responses when appropriate
- Implement rate limiting for API calls
- Provide fallback for API failures
- Show loading states during AI processing
- Log API usage for cost monitoring

## 🔧 Development Workflow

### Before Implementation
1. Read all related documentation
2. Review examples in examples/ folder
3. Plan the implementation approach
4. Create comprehensive task list

### During Implementation
1. Follow established patterns
2. Write tests as you code
3. Commit working code frequently
4. Update documentation as needed

### After Implementation
1. Run all validation commands
2. Ensure all tests pass
3. Check bundle size impact
4. Verify mobile responsiveness
5. Test offline functionality

## 🚫 What NOT to Do

- Don't create files without clear purpose
- Don't ignore TypeScript errors
- Don't skip writing tests
- Don't use any or unknown types
- Don't hardcode values that should be configurable
- Don't ignore accessibility requirements
- Don't commit sensitive data or API keys

## 📋 Commit Message Format

Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting changes
- `refactor:` for code restructuring
- `test:` for test additions
- `chore:` for maintenance tasks

---

**Remember**: Always prioritize code quality, user experience, and maintainability. When in doubt, refer to examples or ask for clarification.