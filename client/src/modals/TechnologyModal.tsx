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
import { TechNode, technologyTree } from '../types/techTreeData';

interface TechnologyModalProps {
  open: boolean;
  onClose: () => void;
}



export const TechnologyModal: React.FC<TechnologyModalProps> = ({ open, onClose }) => {
  
  const [techTree, setTechTree] = useState<TechNode[]>(technologyTree);
  const [selectedCategory, setSelectedCategory] = useState(0);

    const canUnlock = (node: TechNode, tree: TechNode[]) =>
    node.prerequisites.every((pre) => tree.find((n) => n.id === pre)?.unlocked);

  const handleUnlock = (id: string) => {
    setTechTree((prev) =>
      prev.map((node) =>
        node.id === id && canUnlock(node, prev) ? { ...node, unlocked: true } : node
      )
    );
  };

  const categories = Array.from(new Set(techTree.map((node) => node.category)));

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
  const filteredNodes = techTree.filter((node) => node.category === currentCategory);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>Technology Tree</DialogTitle>
      <Tabs value={selectedCategory} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
        {categories.map((category, index) => (
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
          {filteredNodes.map((node) => (
            <Box
              key={node.id}
              gridColumn={node.position.x + 1}
              gridRow={node.position.y + 3} 
            >
              <Paper
                elevation={node.unlocked ? 6 : 2}
                sx={{
                  p: 2,
                  cursor: node.unlocked || canUnlock(node, techTree) ? 'pointer' : 'not-allowed',
                  backgroundColor: node.unlocked
                    ? '#ffd700' 
                    : canUnlock(node, techTree)
                      ? '#c8e6c9' 
                      : '#f5f5f5', 
                  border: '2px solid #999',
                  transition: 'all 0.3s ease-in-out',
                  width: 180,
                  color: !node.unlocked && !canUnlock(node, techTree) ? '#999' : 'inherit',
                }}
                onClick={() => {
                  if (canUnlock(node, techTree)) handleUnlock(node.id);
                }}
              >
                <Typography fontWeight="bold">{node.name}</Typography>
                <Typography variant="body2">{node.description}</Typography>
                <Typography variant="caption">Cost: {node.cost}</Typography>
              </Paper>

            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
