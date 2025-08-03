  const undoLastPayment = async (reason: string = "Mistake in amount") => {
    if (!lastPayment) return;

    try {
      // Mark payment as reversed
      const { error } = await supabase
        .from('payment_records')
        .update({
          status: 'reversed',
          notes: `${lastPayment.notes || ''}\n[REVERSED] ${reason} - Reversed by Current User at ${new Date().toLocaleString()}`
        })
        .eq('id', lastPayment.id);

      if (error) throw error;

      // Log the reversal for audit
      await supabase
        .from('audit_logs')
        .insert({
          action: 'PAYMENT_REVERSED',
          resource_type: 'payment_records',
          resource_id: lastPayment.id,
          old_values: lastPayment,
          new_values: { ...lastPayment, status: 'reversed' },
          user_id: 'current-user-id', // This should come from auth context
        });

      toast({
        title: "Payment Reversed",
        description: `Payment ${lastPayment.receipt_number} has been reversed. Reason: ${reason}`,
        variant: "destructive",
      });

      // Clear the undo option
      setLastPayment(null);
      setUndoTimer(null);
      setRefreshTrigger(prev => prev + 1);

    } catch (error) {
      console.error('Error reversing payment:', error);
      toast({
        title: "Error",
        description: "Failed to reverse payment",
        variant: "destructive",
      });
    }
  };