import React, { useState } from 'react';
import {
  Dialog,
  Badge,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { useTechnologyContext } from '../contexts/TechnologyContext';
import { TechNode } from '../../../shared/techTreeData';
import { useResourceContext } from '../contexts/ResourceContext';

interface TechnologyModalProps {
  open: boolean;
  onClose: () => void;
}

export const TechnologyModal: React.FC<TechnologyModalProps> = ({ open, onClose }) => {
  const { techTree, setTechTree } = useTechnologyContext();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const { resources, setResources } = useResourceContext();
  const safeResources = resources.loot?.books ?? 0;
  
  const categories = Array.from(new Set(techTree.map((node) => node.category)));

  const canUnlock = (node: TechNode, tree: TechNode[]) =>
    node.prerequisites.every((pre) => tree.find((n) => n.id === pre)?.unlocked);

const handleUnlock = (id: string) => {
  const node = techTree.find((n) => n.id === id);
  if (!node) return;

  const cost = node.cost ?? 0;
  const currentBooks = resources.loot?.books ?? 0;

  // Not enough books OR prerequisites not met
  if (currentBooks < cost || !canUnlock(node, techTree)) {
    return; // do nothing
  }

  // Deduct books
  setResources((prev) => ({
    ...prev,
    loot: {
      ...prev.loot,
      books: Math.max(0, (prev.loot?.books ?? 0) - cost),
    },
  }));

  // Unlock the node
  setTechTree(
    techTree.map((n) =>
      n.id === id ? { ...n, unlocked: true } : n
    )
  );
};


  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedCategory(newValue);
  };

  const unlockableCounts: { [category: string]: number } = {};
  categories.forEach((cat) => {
    unlockableCounts[cat] = techTree.filter(
      (node) => node.category === cat && !node.unlocked && canUnlock(node, techTree)
    ).length;
  });

  const currentCategory = categories[selectedCategory];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>Technology Tree</DialogTitle>
      <Tabs value={selectedCategory} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
        {categories.map((category) => (
          <Tab
            key={category}
            label={
              <Badge
                color="secondary"
                badgeContent={unlockableCounts[category] > 9 ? '9+' : unlockableCounts[category]}
                invisible={unlockableCounts[category] === 0}
              >
                {category}
              </Badge>
            }
          />
        ))}
      </Tabs>

      <DialogContent dividers>
        <Box
          display="grid"
          gridTemplateColumns="repeat(8, auto)"
          gridAutoRows="auto"
          gap={4}
          minHeight="500px"
          minWidth="1000px"
        >
          {techTree.map((node) => {
            const isInCategory = node.category === currentCategory;
            const unlocked = node.unlocked;
            const unlockable = canUnlock(node, techTree);

            return (
              <Box
                key={node.id}
                gridColumn={node.position.x + 1}
                gridRow={node.position.y + 3}
              >
                <Paper
                  elevation={unlocked ? 6 : 2}
                  sx={{
                    p: 2,
                    cursor: isInCategory && (unlocked || unlockable) ? 'pointer' : 'not-allowed',
                    backgroundColor: unlocked
                      ? '#ffd700'
                      : isInCategory && unlockable
                        ? '#c8e6c9'
                        : '#f5f5f5',
                    border: '2px solid #999',
                    transition: 'all 0.3s ease-in-out',
                    width: 180,
                    color: !unlocked && (!isInCategory || !unlockable)
                      ? '#999'
                      : 'inherit',
                    opacity: isInCategory ? 1 : 0.4,
                  }}
                  onClick={() => {
                    if (isInCategory && unlockable) handleUnlock(node.id);
                  }}
                >
                  <Typography fontWeight="bold">{node.name}</Typography>
                  <Typography variant="body2">{node.description}</Typography>
                  <Typography
  variant="caption"
  sx={{
    color:
      !unlocked &&
      unlockable &&
      safeResources < (node.cost ?? 0)
        ? 'red'
        : 'inherit',
  }}
>
  Cost: {node.cost}
</Typography>

                </Paper>
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
};
